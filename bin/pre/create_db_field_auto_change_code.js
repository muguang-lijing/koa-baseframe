'use strict';
/**
 * 生成数据库从字段自动变动代码(“从字段”指的是属于其他表中的字段，为方便查询，在当前表也记录一份，其实是主表数据的副本，被动变化)
 */
const fs = require('fs');
const path = require('path');
const utils = require('../../libs/utils');
const mdfupds = require('../../config/field_auto_update');

let models_dir = path.join(utils.baseDir(),'models');
let config_dir = path.join(utils.baseDir(),'config');

/**
 * 1. 生成　模型字段自动更新的配置文件
 */
let out = {};
let fileList = fs.readdirSync(models_dir);
for (let f of fileList){
    if (f=="index.js") { continue; }
    let tableName = f.slice(0,-3);
    let {cols} = require('../../models/'+tableName);
    let fields = Object.keys(cols);
    for (let fd of fields){
        if (fd.indexOf('_f_')==-1){ continue; }
        let fds = fd.split('_f_');
        let tname = fds[1];
        let tfield = fds[0];
        if (tfield == "id") { continue; }
        if (!out[tname]){ out[tname] = {}; }
        if (out[tname][tfield]){
            out[tname][tfield].push(tableName);
        }else{
            out[tname][tfield] = [tableName];
        }
    }
}
fs.writeFileSync(path.join(config_dir,'field_auto_update.js'),`
'use strict';
/**
 * 模型字段自动更新的配置文件
 */
module.exports = `+JSON.stringify(out,null,4));

/**
 * ２. 根据配置文件生成模型中的逻辑代码
 * 大概逻辑思路：
 * 遍历所有的配置，查看对应的model文件中是否已经配置过了，如果没有则生成，
 * 并且检测用户是否定义了afterUpdate钩子，如果定义了，
 * 那就注释掉用户的afterUpdate方法，并提示用户调整代码到新的函数中
 */
for (let tb in mdfupds){
    let sets = mdfupds[tb];
    let tb_path = path.join(models_dir,tb+'.js');
    let tb_str = fs.readFileSync(tb_path,'utf-8');
    // console.log("file content: \n"+tb_str);
    if (~tb_str.search(/link_fields.*=.*require/)){ continue; }
    let reqbk = `const link_fields = require('../config/field_auto_update').${tb} || [];\n`;
    let logbk = '',commonbk = '', utilbk = '';
    let n_of_sqe = tb_str.search(/Sequelize.*=.*require/);
    let n_of_sqeend = tb_str.indexOf('\n',n_of_sqe);
    let bk0 = tb_str.slice(0,n_of_sqeend+1);
    if (tb_str.search(/log.*=.*require/)==-1){
        logbk = `const log = require('../libs/logger').tag('models-${tb}');\n`;
    }
    if (tb_str.search(/auto.*=.*require/)==-1){
        commonbk = `const auto = require('../libs/auto');\n`;
    }
    if (tb_str.search(/util.*=.*require/)==-1){
        utilbk = `const util = require('util');\n`;
    }
    bk0 = bk0 + reqbk + logbk + commonbk + utilbk;
    let updatebk = `
            afterUpdate: async function (ts, options) {
                const models = require('../models');
                let t = options.transaction;
                let trx = t || (await models.sequelize.transaction());
                try {
                    await auto.udaterfield(tableName,link_fields,ts.dataValues,ts._changed,trx);   // { transaction: trx } 
                    /********************用户代码段开始*********************/

                    // TODO 后续逻辑代码
                    // 注：　trx　事务对象一定存在，若不需要事务，可以不使用trx

                    /********************用户代码段结束*********************/
                    t || (await trx.commit());
                } catch (e) {
                    t || (await trx.rollback());
                    log.error({data: util.format('%o',e)},'事务执行失败');
                    throw new Error('Error: 事务执行失败:' + JSON.stringify(e));
                }
            }
        `;
    let n_of_hooks = tb_str.search(/hooks\s*:\s*{/);
    let n_of_afterUpdate,n_of_lhooks,n_of_hookstart,n_of_tableName,n_of_afterUpdateEnd;
    if (n_of_hooks!==-1){ // 有hooks块
        n_of_lhooks = tb_str.indexOf('{',n_of_hooks);
        let bk1 = bk0 + tb_str.slice(n_of_sqeend+1,n_of_lhooks+1);
        let j,flag1 = 1;
        for (j=n_of_lhooks+1; j<tb_str.length; j++){
            if (tb_str[j]=="{"){ flag1++; }
            if (tb_str[j]=="}"){ flag1--; }
            if (flag1===0){
                break;
            }
        }
        let n_of_rhooks = j;
        let bk4 = tb_str.slice(n_of_rhooks);
        let bks = [];
        n_of_afterUpdate = tb_str.indexOf('afterUpdate',n_of_lhooks);
        if (~n_of_afterUpdate){ // 用户自己定义了afterUpdate
            // 注释掉用户的　update 方法，并提示用户调整代码
            let ln = tb_str.indexOf('{',n_of_afterUpdate);
            let flag = 1,i;
            for (i=ln+1; i<tb_str.length; i++){
                if (tb_str[i]=="{"){ flag++; }
                if (tb_str[i]=="}"){ flag--; }
                if (flag===0){
                    break;
                }
            }
            n_of_afterUpdateEnd = i;
            bks[0] = tb_str.slice(n_of_lhooks+1,n_of_afterUpdate);
            bks[1] = tb_str.slice(n_of_afterUpdate,n_of_afterUpdateEnd+1);
            bks[1] = bks[1].split('\n').map(v=>'//'+v).join('\n');
            bks[2] = tb_str.slice(n_of_afterUpdateEnd+1,n_of_rhooks);
            let bks4_a = bks[2];
            bks4_a = bks4_a.replace(/\/\/.*/g,'').replace(/\/\*[\s\S]*?\*\//g,''); // 去掉所有的注释
            bks4_a = bks4_a.replace(/\s+/g,''); // 再去掉所有的空白字符
            if (bks4_a){ // bks4块有内容，逗号和下面的函数
                bks4_a = bks[2];
                let zsbks = bks4_a.match(/(\/\/.*|\/\*[\s\S]*?\*\/)/g);
                for (let k in zsbks){
                    bks4_a = bks4_a.replace(/(\/\/.*|\/\*[\s\S]*?\*\/)/,'--zs--'+k);
                }
                bks4_a = bks4_a.replace(/,/,''); // 去掉一开始的逗号
                let kn = bks4_a.lastIndexOf('}');
                bks4_a = bks4_a.slice(0,kn+1) + ',' + bks4_a.slice(kn+1); // 给最后一个函数补上一个逗号
                for (let k in zsbks){
                    bks4_a = bks4_a.replace('--zs--'+k,zsbks[k]);
                }
                bks[2] = bks4_a;
            }
            var log_str1 = `模型文件 ${tb} 中的方法 afterUpdate 已经被注释，更换成了新的方法，请手动调整代码`;
        }else{
            bks[0] = tb_str.slice(n_of_lhooks+1,n_of_rhooks);
            let bks0 = bks[0].replace(/\/\/.*/g,'').replace(/\/\*[\s\S]*?\*\//g,''); // 去掉所有的注释
            bks0 = bks0.replace(/\s+/g,''); // 再去掉所有的空白字符
            if (bks0){
                bks[0] = bks[0].trimRight() + ',\n';
            }
            var log_str1 = '';
        }
        fs.writeFileSync(tb_path,bk1+bks.join('')+updatebk+bk4);
        log_str1 && console.log(log_str1);
    }else{
        n_of_tableName = tb_str.search(/freezeTableName/);
        let bk1 = bk0 + tb_str.slice(n_of_sqeend+1,n_of_tableName);
        let bk2 = `
        hooks: {${updatebk}},\n
        `;
        let bk3 = tb_str.slice(n_of_tableName);
        fs.writeFileSync(tb_path,bk1+bk2+bk3);
    }
}

console.log("副本字段自动变更 代码已生成完毕");
