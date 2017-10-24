'use strict';
/**
 * 同步表（包括系统表和日志表），在终端如下输入：
 * node bin/init_table all/table_name -> 同步系统表
 * node bin/init_table the_log_db ->　同步日志表
 */

let args = process.argv.splice(2);
if (args.length == 0) {
    console.log("\x1B[41m使用提示：第一个参数为表名时，同步当前表；第一个参数为all时，同步所有表。\x1B[49m");
    process.exit(0);
}

const models = require('../models');
const fs = require('fs');
const path = require('path');
const Table = require('cli-table');
const _ = require('lodash');
let table = args[0].toLocaleLowerCase();
let minfo = _.cloneDeep(models.modelInfos);
//临时文件作备份用，同步完系统自动删除
let temp_file = path.dirname(__dirname) + "/public/res/temp/.sync_db.json";

setTimeout(() => {
    (async () => {
        if (table == 'all') {
            let r = await read("\x1B[41m当前操作会同步所有表结构到线上，并清空数据，确定？（y/n）\x1B[49m");
            r = r.toLocaleLowerCase().replace(/(^\s*)|(\s*$)/g, "");
            r = await handle_tips(r);
            if(r=='y'){
                await sync_all_table(models);
            }else{
                console.log(`\x1B[33m取消操作！\x1b[0m`);
                process.exit(0);
            }
        }else if (table == 'the_log_db'){
            const models = require('../libs/log_models');
            await sync_all_table(models);
            console.log("日志数据库表同步成功！");
        }else{
            await sync_one_table();
        }
    })()
}, 500);

//同步所有表格
async function sync_all_table(models) {
    try {
        await models.sequelize.sync({
            force: true
        });
        console.log('所有表同步成功！');
        process.exit(0);
    } catch (e) {
        console.error('表同步失败');
        console.error(e);
        process.exit(1);
    };
}

//同步一个表格
async function sync_one_table() {
    //检查是否存在用户输入的数据库
    if (minfo[table] == undefined) {
        console.log(`\x1B[41m数据表${table}不存在！\x1B[49m`);
        return;
    } else {
        /**操作步骤
         * 1、先比较线上与本地数据库的差异，再确认下一步
         * 2、备份当前数据库到文件
         * 3、强制更新数据表
         * 4、恢复数据到新表
         */
        //第一步
        console.log(`\x1B[33m1、比较线上与本地表结构。\x1b[0m`);
        let ret = await diff_table(table);
        if (ret == "second") {
            //第二步，备份线上数据，为了防止本地模型的表结构与线上的不一致，导致本地抛出异常，这里用原声语句查询
            let res = await models.exec(`SELECT * FROM ${table}`);
            fs.writeFileSync(temp_file, JSON.stringify(res));
            console.log(`\x1B[33m2、${table}表已备份。\x1b[0m`);
        }
        //第三步
        try {
            await models[table].sync({
                force: true
                //,logging: console.log
            });
            console.log(`\x1B[33m3、${table}表结构同步完成。\x1b[0m`);
        } catch (e) {
            console.log(e);
            console.log(`\x1B[33m3、${table}表结构同步出错！\x1b[0m`);
            process.exit(-1);
        }
        //第四步
        if(ret == "second"){
            let read_res = fs.readFileSync(temp_file);
            let read_data = JSON.parse(read_res);
            await models[table].bulkCreate(read_data);
            fs.unlink(temp_file);
        }
        console.log(`\x1B[33m4、${table}表数据已恢复。\x1b[0m`);
        console.log(`\x1B[33m=============================================\x1b[0m`);
        console.log(`\x1B[41m所有同步操作已完成！\x1B[49m`);
        process.exit(0);
    }
}

//比较线上与本地table表模型的差异，并与表格的形式显示出来
async function diff_table(table) {
    let online_table = await models.exec(`SELECT to_regclass('${table}')`);
    online_table = online_table[0]['to_regclass'];
    let local_table = minfo[table];
    if (!online_table && !local_table) {
        console.log(`\x1B[41m线上与本地都找不到${table}表\x1B[49m`);
        process.exit(0);
    } else {
        if (online_table && !local_table) {
            console.log(`\x1B[41m线上存在${table}表，本地不存在${table}表！\x1B[49m`);
            process.exit(0);
        }
        if (!online_table && local_table) {
            console.log(`\x1B[41m线上不存在${table}表，本地存在${table}表！\x1B[49m`);
            let line = await tips();
            //执行第三步
            if (line == "y") { return "third" };
        } else {
            console.log("===============  线上和本地都存在这个表  ===================");
            //线上和本地都存在这个表

            var online_jg = await models.exec(`
                    SELECT a.attnum,
                        a.attname AS field,
                        t.typname AS type,
                        a.attlen AS length,
                        a.atttypmod AS lengthvar,
                        a.attnotnull AS notnull,
                        b.description AS comment
                    FROM pg_class c,
                        pg_attribute a
                        LEFT OUTER JOIN pg_description b ON a.attrelid=b.objoid AND a.attnum = b.objsubid,
                        pg_type t
                    WHERE c.relname = '${table}'
                        and a.attnum > 0
                        and a.attrelid = c.oid
                        and a.atttypid = t.oid
                    ORDER BY a.attnum
                `);
            //初始化线上与本地比较对象
            var online_diff = { [table]: {} };
            var local_diff = { [table]: {} };
            for (let i of online_jg) {
                online_diff[table][i['field']] = i;
            }
            //console.log(JSON.stringify(online_diff,null,4));
            //结构如下：
            /* {
                "表名"：{
                    "字段1":{字段结构},
                    "字段2"：{字段结构}，
                    ......
                }
            } */
            var local_jg = minfo[table];
            for (let m in local_jg['cols']) {
                local_diff[table][m] = local_jg['cols'][m];
                local_diff[table][m]['type'] = local_diff[table][m]['type'].toSql() + "";
            }
            //键值
            var online_keys = Object.keys(online_diff[table]).sort();
            var local_keys = Object.keys(local_diff[table]).sort();
            //比较数组
            var diff_arr_res = array_diff(online_keys, local_keys);
            var new_online_keys = diff_arr_res[0];
            var new_local_keys = diff_arr_res[1];
            // console.log(new_online_keys);
            // console.log("-------------------------------------------------");
            // console.log(new_local_keys);
            // process.exit(0);
            //打印终端表格
            var console_table = new Table({
                //head: ['序号', '线上字段', '本地字段', '字段名称一致性', '字段类型一致性']
                head: ['index', 'online--' + table, 'local--' + table, 'name', 'type']
                , colWidths: [5, 20, 20, 10, 30]
                , style: { head: ['yellow'], border: ['blue'], 'padding-left': 0, 'padding-right': 0 }
            });
            var tblen = new_online_keys.length; //或者new_local_keys.length
            for (let i = 0; i < tblen; i++) {
                let judge_name = new_online_keys[i] == new_local_keys[i] ? '√' : 'x';
                if (judge_name == 'x') {
                    var judge_type = 'x';
                } else {
                    //类型
                    let online_type = online_diff[table][new_online_keys[i]]['type'].toLocaleLowerCase();
                    let local_type = local_diff[table][new_local_keys[i]]['type'].toLocaleLowerCase();
                    if (online_type == "varchar") {
                        online_type = "varchar(" + (online_diff[table][new_online_keys[i]]['lengthvar'] - 4) + ")";
                    }
                    var judge_type = type_diff(online_type, local_type);
                }
                console_table.push(
                    [i + 1, new_online_keys[i], new_local_keys[i], judge_name, judge_type]
                );
            }
            // console.log(console_table);
            // process.exit(0);

            console.log(console_table.toString());
            let line = await tips();
            //执行第二步
            if (line == "y") { return "second" };
        }
    }
}

//终端等待用户输入
function read(prompt) {
    return new Promise(resolve => {
        process.stdout.write(prompt + '>');
        process.stdin.resume();
        process.stdin.setEncoding('utf-8');
        process.stdin.on('data', function (chunk) {
            process.stdin.pause();
            resolve(chunk);
        });
    })
}
async function tips() {
    let r = await read("按Y键将表格同步到线上，其他任意键取消操作。");
    r = r.toLocaleLowerCase().replace(/(^\s*)|(\s*$)/g, "");
    if (r != "y") {
        console.log("用户取消操作！");
        process.exit(0);
    } else {
        return "y";
    }
}

//比较两个数组是否一样
function array_diff(arr1, arr2) {
    //创建可移除副本
    let copy_arr1 = _.cloneDeep(arr1), copy_arr2 = _.cloneDeep(arr2);
    //公共部分
    let common = [];
    for (let i of arr1) {
        if (~arr2.indexOf(i)) {
            common.push(i);
            removeByValue(copy_arr1, i);
            removeByValue(copy_arr2, i);
        }
    }
    if (copy_arr1.length == 0 && copy_arr2.length == 0) {
        //全部一样
        return [common, common];
    } else {
        arr1 = _.cloneDeep(common); arr2 = _.cloneDeep(common);
        arr1 = arr1.concat(copy_arr1);
        for (let i in copy_arr2) {
            arr1.push("x");
        }
        for (let i in copy_arr1) {
            arr2.push("x");
        }
        arr2 = arr2.concat(copy_arr2);
        return [arr1, arr2];
    }
}

//传进本地表字段模型，判断是否和线上的一致
/**
 * 
 * @param {String} online_type 线上类型
 * @param {String} local_type 本地类型
 */
function type_diff(online_type, local_type) {
    let wrong_type = `${online_type} | ${local_type}`;
    //字符串类型
    if (~local_type.indexOf("varchar")) {
        if (online_type == local_type) {
            return "√";
        } else {
            return wrong_type;
        }
    }
    //整型
    else if (local_type == "integer") {
        let ret = online_type == "int4" ? "√" : wrong_type;
        return ret;
    }
    //枚举类型
    else if (local_type == "enum") {
        let ret = ~online_type.indexOf(local_type) ? "√" : wrong_type;
        return ret;
    }
    //其他类型
    else {
        return wrong_type;
    }
}

//处理确认值
async function handle_tips(res) {
    if (res != 'y' && res != 'n') {
        let tips = "请输入y或n";
        res = await read(`\x1B[41m${tips}\x1B[49m`);
        res = res.toLocaleLowerCase().replace(/(^\s*)|(\s*$)/g, "");
        return await handle_tips(res);
    } else {
        return res;
    }
}

//根据值删除数组里面的元素
function removeByValue(arr, val) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] == val) {
            arr.splice(i, 1);
            break;
        }
    }
}