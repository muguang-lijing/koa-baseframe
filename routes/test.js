'use strict';

const Router = require('koa-router');
const router = new Router();
const log = require('../libs/logger').tag('test');
const config = require('../config');
const common = require('../libs/common');
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

router.get('/redis', ctx => {
    ctx.body = "test ok";
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

router.get('/roletest1', ctx => {
    ctx.body = ctx.method + ' : ' + ctx.path;
});

router.get('/roletest2', ctx => {
    ctx.body = ctx.method + ' : ' + ctx.path;
});

router.post('/roletest2', ctx => {
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