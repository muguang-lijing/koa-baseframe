'use strict';

const Router = require('koa-router');
const router = new Router();
const log = require('../libs/logger').tag('test');
const config = require('../config');
const common = require('../libs/common');
const utils = require('../libs/utils');
const util = require('util');
const redis = config.redis;

router.get('/', ctx => {
//  this.redirect("/dist/pc/login.html");
    ctx.body = "test ok";
});

router.get('/usrli_normal', ctx => {
    ctx.session.uid = 'xxsdjfi9eiruwe8uier';
    ctx.session.role = 'normal';
    ctx.session.uinfo = { name: 'lijing' };
    ctx.body = "ok";
});

router.get('/usrli_visitor', ctx => {
    ctx.session.uid = 'iuiiiiiiiiiiid8fieiur';
    ctx.session.role = 'visitor';
    ctx.session.uinfo = { name: 'lifei' };
    ctx.body = "ok";
});

router.get('/getuinfo', ctx => {
    ctx.body = ctx.session;
});

/**
 * @api {post} /test/redis redis测试  
 * @apiDescription 作者：李静  
 * 
 * @apiVersion 0.0.2
 * @apiName redis
 * @apiGroup Test
 * 
 * @apiParam {String} id 测试id
 * @apiParam {Number} num 设置的值　可不填　默认值(-1) 最大值(100) 最小值(-100) 
 * @apiParam {Array} codes 代码值数组 数组值类型(number) 最短(1)
 * @apiParam {Number} status 状态值 枚举值(34,3,9)
 * @apiParam {String} content 内容字符串　限长(5)
 * @apiParam {Boolean} is_free 是否免费
 * @apiParam {Object} remark 备注信息　可不填　默认值({"name":"lijing","age":34}) 必有字段(name<string>,age<number>)
 * 
 * @apiSuccess {Object} err 错误信息
 * @apiSuccess {Object} out 成功信息 
 * @apiSuccessExample {json} 成功时返回的结果：
 * {
 * 	err: { code: 0 },
 * 	out: {
 * 		
 * 	}
 * }
 */
router.post('/redis', ctx => {
    ctx.body = "test ok:\n"+JSON.stringify(ctx.request.body,null,4);
});

router.get('/exit', ctx => {
    process.exit(0);
});

router.post('/savefile', async ctx => {
    let file = ctx.request.body.files.pic;
    ctx.body = await common.saveFile(file,{
        max_size: 10000,
        name: 'jiuhh.jpg',
        save_path: '/home/lj/桌面',
        save_path_is_absolute: true
    });
});

/**
 * @api {post} test/roletest1 测试路由２  
 * @apiDescription 作者：李静  
 * 
 * @apiVersion 0.0.2
 * @apiName roletest1
 * @apiGroup Test
 * 
 * @apiParam {String} name 名称　限长(20)
 * @apiParam {Number} age 年龄　最大值(200)　最小值(0)
 * @apiParam {Array} interests 兴趣　限长(3)
 * @apiParam {Object} des 简介
 * 
 * @apiSuccess {Object} err 错误信息
 * @apiSuccess {Object} out 成功信息
 * @apiSuccessExample {json} 成功时返回的结果：
 * {
 * 	err: { code: 0 },
 * 	out: {
 * 		
 * 	}
 * }
 */
router.get('/roletest1', ctx => {
    ctx.body = ctx.method + ' : ' + ctx.path;
});

router.get('/roletest2', ctx => {
    ctx.body = ctx.method + ' : ' + ctx.path;
});

router.post('/roletest2', ctx => {
    let f = {
        method: ctx.method,
        flag: 23
    };
    log.info({data: f},"测试ｌｏｇ");
    log.info({data: "haha"},"测试ｌｏｇ");
    ctx.body = ctx.method + ' : ' + ctx.path;
});

router.post('/roletest3', ctx => {
    ctx.body = ctx.method + ' : ' + ctx.path;
});

router.get('/setredistst', async ctx => {
    await redis.set('namex',ctx.query.name);
    ctx.body = "ok";
});

router.get('/getredistst1', async ctx => {
    let reout = await redis.get('xxoo123');
    ctx.body = reout;
});

router.get('/redistest1', async (ctx,next) => { // 订阅redis频道
    await redis.subscribe('test1');
    ctx.body = "ok";
});

router.get('/redistestpush', async (ctx,next) => { // 发布redis频道
    await redis.publish('test1','hello koa2-framework');
    ctx.body = "ok";
});

redis.on('message',(channel,message)=>{ // 监听redis收到的消息
    console.log('##### Receive message %s from channel %s', message, channel);
})

router.get('/redisTest', async ctx => {
    // console.log("############# pid: "+process.pid);
    let reout = await redis.get('namex');
    let sum = 0;
    for (let i=0; i<1000000; i++){
        sum += i;
    }
    ctx.body = {
        err: "",
        out: { pid: process.pid, reout }
    };
});



module.exports = router;