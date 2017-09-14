"use strict"

const config = require('../config');
const utils = require('../libs/utils');
const rp = require('request-promise');
const log_models = require('../libs/log_models');
const uuid = require('uuid');

process.stdin.setEncoding('utf8');

process.stdin.on('end', () => {
    process.stdout.write('log stdin end');
});

let log_table_name = 'datas';

let isPro = utils.isProduction();

process.stdin.on('data',async thunk => {
     if (isPro){ 
        let outsr = '['+thunk.replace(/\n/g,',').slice(0,-1)+']';
        let objs = JSON.parse(outsr);
        for (let o of objs){
            o.time = parseInt(new Date(o.time).valueOf()/1000);
            if (o.msg == "请求信息"){
                o.id = o.reqId;
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
    }else{
        console.log(thunk);
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