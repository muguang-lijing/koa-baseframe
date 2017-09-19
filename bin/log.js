"use strict"

const config = require('../config');
const rp = require('request-promise');
const log_models = require('../libs/log_models');
const uuid = require('uuid');

process.stdin.setEncoding('utf8');

process.stdin.on('end', () => {
    process.stdout.write('log stdin end');
});

let log_table_name = 'datas';
let blood = 25; // 进程的血量，当血量用完时进程就会死掉
setInterval(()=>{
    blood -= 7;
    if (blood > 0){
        // console.log("============log process alive: "+blood);
    }else{
        // console.log("============log process die");
        process.exit(0);
    }
},7000);

process.stdin.on('data',async thunk => {
    if (~thunk.indexOf('##ok##')){
        // console.log("=========== process log 补血成功，进程号: "+process.pid);
        blood += 7;
        return;
    }
    let outsr = '['+thunk.replace(/\n/g,',').slice(0,-1)+']';
    let objs = JSON.parse(outsr);
    for (let o of objs){
        o.time = parseInt(new Date(o.time).valueOf()/1000);
        if (o.msg == "请求信息"){
            // console.log("request info: \n"+JSON.stringify(o,null,4));
            o.id = o.reqId;
            if (typeof o.res_body !== "string"){
                o.res_body = JSON.stringify(o.res_body);
            }
            await log_models.request.create(o);
        }else{
            o.id = uuid.v1();
            if (o.data && typeof o.data!=="object"){
                o.data = {info: o.data};
            }
            await log_models.log.create(o);
        }
        // logFileter(o);
    }
});

function logFileter(log){
    if (log.level >= 50){
        let log_str = `错误日志：\n
        msg: ${log.msg}\n
        data: ${log.data}\n
        tag: ${log.tag}\n
        time: ${log.time}
        `;
        rp({
            method: 'POST',
            uri: 'http://127.0.0.1:12345/putout_errorlog',
            headers: {
                'flag': parseInt(Date.now()/3600000).toString(2)
            },
            body: {
                error_log: log_str
            },
            json: true 
        }).then(res=>{
        }).catch(err=>{
            console.log("+++++++++++ error: "+JSON.stringify(err));
        });
    }
}