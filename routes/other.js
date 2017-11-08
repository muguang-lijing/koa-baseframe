'use strict';

const Router = require('koa-router');
const router = new Router();
const log = require('../libs/logger').tag('other');
const config = require('../config');
const common = require('../libs/common');
const utils = require('../libs/utils');
const uuid = require('uuid');
const {fs} = require('mz');

/**
 * 上传1张或多张图片
 */
router.post('/upload_img', async ctx => {
    let body_files = ctx.request.body.files;
    let outObj = {};
    for (let fname in body_files){
        outObj[fname] = await common.saveFile(body_files[fname]);
    }
    ctx.body = {
        err: "",
        out: outObj
    };
});

/**
 * @api {post} /other/upload_base64 上传base64格式的数据
 * @apiDescription 作者：李静   
 * @apiVersion 0.0.1
 * @apiName uploadBase64
 * @apiGroup Other
 * 
 * @apiParam {String} str base64数据
 * 
 * @apiSuccess {String} err 错误信息，成功则为空
 * @apiSuccess {Object} out 上传成功的文件访问地址
 * @apiSuccessExample {json} 成功时返回的结果：
 * {
 *   err: "",
 *   out: { url: "http://skill.szshanlian.com/res/imgs/234eriu.jpg" }
 * }
 */
router.post('/upload_base64', async ctx => {
    let base64 = ctx.request.body.str;
    let in64 = base64.indexOf('base64');
    let head_str = base64.slice(0,in64-1);
    let fux = head_str.replace('data:image/','.');
    let body_str = base64.slice(in64+7);
    let fileBuffer = new Buffer(body_str,'base64');
    let access_path = path.join('res','imgs',uuid.v1()+fux);
    let aimPath = path.join(utils.baseDir(),'public',access_path);
    await fs.writeFile(aimPath, fileBuffer);
    let access_full_path = path.join(config.host,access_path);
    ctx.body = {
        err: "",
        out: { access_path, access_full_path }
    };
});

/**
 * @api {get} /other/is_login 判断是否登录  
 * @apiDescription 作者：李静  
 * 
 * @apiVersion 0.0.1
 * @apiName is_login
 * @apiGroup Other
 * 
 * @apiSuccess {Object} err 错误信息
 * @apiSuccess {Object} out 成功信息
 * @apiSuccessExample {json} 成功时返回的结果：
 * {
 * 	err: { code: 0 },
 * 	out: {
 * 		result: false, // 若没有登录是false，若登录则是角色名称
 * 	}
 * }
 */
router.get('/is_login', async (ctx,next) => {
    let result = false;
    if (ctx.session && ctx.session.uid){
        result = ctx.session.role;
    }
    ctx.body = {
        err: { code: 0},
        out: { result }
    };
});

module.exports = router;