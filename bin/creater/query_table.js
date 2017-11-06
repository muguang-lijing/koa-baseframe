'use strict';
/**
 * 单表查询的路由生成器
 */

const args = process.argv.splice(2);
const models = require('../../models');
const util = require('util');
const beautify = require('js-beautify').js_beautify;

/************************ 配置 **************************/

let conf = {
    router_file: '', // 路由文件名，此处如果不设置，则要通过命令行第一个参数提供
    table: 'banner', // 表名[必填]，用户提供
    is_page: true, // 是否分页
    where: {}, // 查询条件
    attrs: null, // 字段，默认所有字段全部列出，用户也可以直接设置（数组或对象）
    order: 1, // 排序,数字，指定生成排序结构的个数，生成结构后由用户填写
    is_count_all: true, // 是否带总条数
    is_fields_tip: true, // 是否列出字段提示，以方便用户查看
    is_filter_struct: false // 是否生成过滤结构
};

/* 默认配置，请不要改动下面的默认配置，以便可以恢复到默认配置
let conf = {
    router_file: '', // 路由文件名，此处如果不设置，则要通过命令行第一个参数提供
    table: 'banner', // 表名[必填]，用户提供
    is_page: true, // 是否分页
    where: {}, // 查询条件
    attrs: null, // 字段，默认所有字段全部列出，用户也可以直接设置（数组或对象）
    order: 1, // 排序,数字，指定生成排序结构的个数，生成结构后由用户填写
    is_count_all: true, // 是否带总条数
    is_fields_tip: true, // 是否列出字段提示，以方便用户查看
    is_filter_struct: false // 是否生成过滤结构
};
*/

/********************************************************/

const todo_str = 'todo..';
const todo_str_zs = `/* ${todo_str} */`;

if (!conf.router_file){
    conf.router_file = args[0];
    if (!conf.router_file){
        error_exit('路由文件名缺失，由命令行第一个参数提供，或者在脚本文件中直接设置');
    }
}

if (!conf.table){
    error_exit('失败！表名未提供'); 
}

let fields = Object.keys(models.modelInfos[conf.table].cols);
if (!conf.attrs){
    conf.attrs = fields.slice();
}

let order_str = [];
for (let i=0; i<conf.order; i++){
    order_str.push([`${todo_str}`, 'DESC']);
}

let sub_router = `${conf.table}_list`;
let page_str0 = `\n * @apiParam {String} page 页码 可不填
 * @apiParam {String} len 页长 可不填`;
let page_str1 = `\n    let page = query.page || 0;
    let len = query.len || 10;`;
let page_str2 = `\n        limit: parseInt(len),
        offset: page * len,`;
let where_str = '{}';
if (conf.where){
    where_str = JSON.stringify(conf.where);
}
let fields_tip_str = '';
if (conf.is_fields_tip){
    fields_tip_str = `\n// 表 ${conf.table} 所有字段：${fields}`;
}
let filter_struct_str = '';
if (conf.is_filter_struct){
    filter_struct_str = `\n    datas = JSON.parse(JSON.stringify(datas));
    for (let c of datas) {\n${todo_str_zs}}`;
}

let template_str = `
/**
 * @api {get} /${conf.router_file}/${sub_router} 获取${conf.table}列表  
 * @apiDescription 作者：System  
 * 
 * @apiVersion 0.0.1
 * @apiName get_${conf.table}_list
 * @apiGroup System_auto
 * ${conf.is_page ? page_str0 : ''}
 * 
 * @apiSuccess {Object} err 错误信息
 * @apiSuccess {Object} out 成功信息
 * @apiSuccessExample {json} 成功时返回的结果：
 * {
 * 	err: { code: 0 },
 * 	out: {${conf.is_count_all ? '\n * 		count: 34,' : ''}
 *      datas: [ ... ] 
 * 	}
 * }
 */
router.get('/${sub_router}', async (ctx, next) => {
    let query = ctx.query;${fields_tip_str} ${conf.is_page ? page_str1 : ''}
    let whereOption = ${where_str};
    let ${conf.is_count_all ? 'result': 'datas'} = await models.${conf.table}.find${conf.is_count_all ? 'AndCount': ''}All({
        where: whereOption,${conf.is_page ? page_str2 : ''}
        attributes: ${JSON.stringify(conf.attrs)},
        order: ${JSON.stringify(order_str)}
    });${conf.is_count_all ? '\nlet datas = result.rows;' : ''} ${filter_struct_str}
    ctx.body = {
        err: { code: 0 },
        out: {${conf.is_count_all ? '\ncount: result.count,' : ''}
            datas
        }
    };
});
`;

template_str = beautify(template_str, { indent_size: 4 }); // 格式化
console.log(template_str);
process.exit(0);

function error_exit(msg){
    console.log(`\x1B[41m${msg}\x1B[49m`);
    process.exit(0);
}




