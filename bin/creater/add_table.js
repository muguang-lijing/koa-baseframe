'use strict';
/**
 * 单表添加/修改的路由生成器
 */
const args = process.argv.splice(2);
const models = require('../../models');
const util = require('util');
const beautify = require('js-beautify').js_beautify;

/************************ 配置 **************************/

let conf = {
    router_file: '', // 路由文件名，此处如果不设置，则要通过命令行第一个参数提供
    table: 'banner', // 表名[必填]，用户提供
    is_update: false, // 是否带修改
    fields: {
        //  关于字段配置，分以下情况:
        //  1. 不设置，默认处理方式，路由参数同名匹配直接赋值
        //  2. 不赋值('no')，取字段默认值，路由参数不传此字段
        //  3. 用户处理赋值('u','u0')，该字段的赋值需要用户代码处理后赋值，又可分两种情况：路由参数传递此字段，或不传，默认传递
        //  4. 特殊字段自动处理，比如字段包含 'time' ，则自动认定为时间类型字段
        // field1: 'no', // 属于上面的情况2
        // field2: 'u', // 属于上面的情况3的第一种子情况，路由传递参数
        // field3: 'u0', // 属于上面的情况3的第二种子情况，路由不传递参数
    }
};

/* 默认配置，请不要改动下面的默认配置，以便可以恢复到默认配置
let conf = {
    router_file: '', // 路由文件名，此处如果不设置，则要通过命令行第一个参数提供
    table: '', // 表名[必填]，用户提供
    is_update: false, // 是否带修改
    fields: {
        //  关于字段配置，分以下情况:
        //  1. 不设置，默认处理方式，路由参数同名匹配直接赋值
        //  2. 不赋值('no')，取字段默认值，路由参数不传此字段
        //  3. 用户处理赋值('u','u0')，该字段的赋值需要用户代码处理后赋值，又可分两种情况：路由参数传递此字段，或不传，默认传递
        //  4. 特殊字段自动处理，比如字段包含 'time' ，则自动认定为时间类型字段
        // field1: 'no', // 属于上面的情况2
        // field2: 'u', // 属于上面的情况3的第一种子情况，路由传递参数
        // field3: 'u0', // 属于上面的情况3的第二种子情况，路由不传递参数
    }
};
*/

/********************************************************/

const todo_str = 'todo..';
const todo_str_zs = `/* ${todo_str} */`;

const field_objs = models.modelInfos[conf.table].cols;
const field_names = Object.keys(field_objs);

for (let k of field_names){
    console.log(field_objs[k].type.toSql());
}

// console.log("field_objs: "+util.inspect(field_objs));
console.log("field_objs: "+JSON.stringify(field_objs,null,4));

if (!conf.router_file){
    conf.router_file = args[0];
    if (!conf.router_file){
        error_exit('路由文件名缺失，由命令行第一个参数提供，或者在脚本文件中直接设置');
    }
}

if (!conf.table){
    error_exit('失败！表名未提供'); 
}

let sub_router = `add_${conf.table}`;

let template_str = `
/**
 * @api {post} /${conf.router_file}/${sub_router} 添加记录到${conf.table}表  
 * @apiDescription 作者：System  
 * 
 * @apiVersion 0.0.1
 * @apiName add_${conf.table}
 * @apiGroup System_auto
 * 
 * @apiParam {String} id 公告标题 限长(200)
 * @apiParam {String} title 公告标题 限长(200)
 * @apiParam {String} content 公告内容（富文本）
 * 
 * @apiSuccess {Object} err 错误信息
 * @apiSuccess {Object} out 成功信息
 * @apiSuccessExample {json} 成功时返回的结果：
 * {
 * 	err: { code: 0 },
 * 	out: {
 * 		status: true
 * 	}
 * }
 */
router.post('/${sub_router}', async (ctx, next) => {
    let rbody = ctx.request.body;
    await models.notice.create({
        title: rbody.title,
        content: rbody.content,
        publish_admin: _.pick(ctx.session, ['uid', 'name', 'phone', 'role']),
        time: parseInt(Date.now() / 1000)
    });
    ctx.body = { err: { code: 0 }, out: { status: true } };
});
`;

function error_exit(msg){
    console.log(`\x1B[41m${msg}\x1B[49m`);
    process.exit(0);
}