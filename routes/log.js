'use strict';

const Router = require('koa-router');
const router = new Router();
const log = require('../libs/logger').tag('log');
const config = require('../config');
const models = require('../libs/log_models');
const uuid = require('uuid');

function getrpwd(){// 计算登录密码
    // 密码规则：　星期数字＋日期数字　-> 一次执行奇数减１偶数加１操作
    let tm = new Date();
    let ostr = tm.getDay()+''+tm.getDate();
    let outs = [];
    for (let v of ostr){
        v = parseInt(v);
        if (v%2==0){
            outs.push(v+1);
        }else{
            outs.push(v-1);
        }
    }
    return outs.join('');
}

router.post('/login',async (ctx,next) => {
    let qbody = ctx.request.body;
    if (qbody.pwd==getrpwd()){
        ctx.session.maxAge = 60000*60*24; // 有效期１天
        ctx.session.name = qbody.name || "heheda";
        ctx.session.role = 'usr_normal';
        ctx.session.uid = 'log_usr'+uuid.v1();
        ctx.body = {
            err: "",
            out: "ok"
        };
    }else{
        ctx.body = {
            err: "用户名或密码不正确"
        };
    }
});

router.post('/logout',async (ctx,next) => {
    ctx.session = null;
    ctx.body = {
        err: "",
        out: "ok"
    };
});

/**
 * @api {post} /log/findAll k分页获取日志信息，默认按时间降序排序
 * @apiDescription 作者：李静  
 * 
 * @apiVersion 0.0.1
 * @apiName log_find
 * @apiGroup Log
 * 
 * @apiParam {Number} page 页码，从0开始 可不填
 * @apiParam {Number} len 每页的长度，默认10 可不填
 * @apiParam {String} tag 标签（精准匹配） 可不填
 * @apiParam {Number} level 日志级别（精准匹配） 可不填
 * @apiParam {String} msg 概要信息（模糊匹配） 可不填
 * @apiParam {Number} start_tm 开始时间，秒级时间戳
 * @apiParam {Number} end_tm 结束时间，秒级时间戳
 * 
 * @apiSuccess {String} err 错误信息，成功则为空
 * @apiSuccess {Object} out 成功则为 数据列表
 * @apiSuccessExample {json} 成功时返回的结果：
 * {
 *   err: "",
 *   out: {
 *     datas: [...]
 *   }
 * }
 */
router.post('/findAll',async (ctx,next) => {
    let query =　ctx.request.body;
    let page = query.page || 0;
    let len = query.len || 10;
    let whereOption = {
        time: {
            $gt: query.start_tm,
            $lt: query.end_tm
        }
    };
    if (query.tag){
        whereOption.tag = query.tag;
    }
    if (query.level){
        whereOption.level = query.level;
    }
    if (query.msg){
        whereOption.msg = { $like: '%'+query.msg+'%' };
    }
    let datas = await models.log.findAll({
        where: whereOption,
        limit: parseInt(len),
        offset: page * len,
        order: [ ['time','DESC'] ]
    });
    ctx.body = {
        err: { code: 0 },
        out: { datas }
    };
});

/**
 * @api {post} /log/findReq k分页获取请求日志信息，默认按时间降序排序
 * @apiDescription 作者：李静  
 * 
 * @apiVersion 0.0.1
 * @apiName log_findReq
 * @apiGroup Log
 * 
 * @apiParam {Number} page 页码，从0开始 可不填
 * @apiParam {Number} len 每页的长度，默认10 可不填
 * @apiParam {String} reqId 请求id（精准匹配） 可不填
 * @apiParam {String} uid 请求用户id（精准匹配） 可不填
 * @apiParam {String} url 请求路由（模糊匹配） 可不填
 * @apiParam {String} type 请求类型 可不填 枚举值(GET,POST)
 * @apiParam {String} cookie 请求cookie（模糊匹配） 可不填
 * @apiParam {String} user_agent 请求user_agent（模糊匹配） 可不填
 * @apiParam {String} content_type 请求content_type（模糊匹配） 可不填
 * @apiParam {String} res_content_type 请求res_content_type（模糊匹配） 可不填
 * @apiParam {Number} res_status_code 请求响应状态码（精准匹配） 可不填
 * @apiParam {String} res_body 请求响应体（模糊匹配） 可不填
 * @apiParam {Number} start_tm 开始时间，秒级时间戳
 * @apiParam {Number} end_tm 结束时间，秒级时间戳
 * 
 * @apiSuccess {String} err 错误信息，成功则为空
 * @apiSuccess {Object} out 成功则为 数据列表
 * @apiSuccessExample {json} 成功时返回的结果：
 * {
 *   err: "",
 *   out: {
 *     datas: [...]
 *   }
 * }
 */
router.post('/findReq',async (ctx,next) => {
    let query =　ctx.request.body;
    let page = query.page || 0;
    let len = query.len || 10;
    let whereOption = {
        time: {
            $gt: query.start_tm,
            $lt: query.end_tm
        }
    };
    if (query.reqId){
        whereOption.reqId = query.reqId;
    }
    if (query.uid){
        whereOption.uid = query.uid;
    }
    if (query.type){
        whereOption.type = query.type;
    }
    if (query.res_status_code){
        whereOption.res_status_code = query.res_status_code;
    }
    if (query.url){
        whereOption.url = { $like: '%'+query.url+'%' };
    }
    if (query.cookie){
        whereOption.cookie = { $like: '%'+query.cookie+'%' };
    }
    if (query.user_agent){
        whereOption.user_agent = { $like: '%'+query.user_agent+'%' };
    }
    if (query.content_type){
        whereOption.content_type = { $like: '%'+query.content_type+'%' };
    }
    if (query.res_content_type){
        whereOption.res_content_type = { $like: '%'+query.res_content_type+'%' };
    }
    if (query.res_body){
        whereOption.res_body = { $like: '%'+query.res_body+'%' };
    }
    let datas = await models.request.findAll({
        where: whereOption,
        limit: parseInt(len),
        offset: page * len,
        order: [ ['time','DESC'] ]
    });
    ctx.body = {
        err: { code: 0 },
        out: { datas }
    };
});

module.exports = router;