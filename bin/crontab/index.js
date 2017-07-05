"use strict"
const child_process = require('child_process');
const path = require('path');
const utils = require('../../libs/utils');
const log = require('../../libs/logger').tag('crontab');
const fs = require('fs');
let cp_dir = path.join(utils.baseDir(),'bin/crontab');

module.exports = function (){
    (async ()=>{
        global.n++;
        if (global.n%50==0){ // 每50分钟触发一次
            let tm = new Date();
            let cur_date = tm.getDate();
            if (tm.getHours()==4 && global.day_task_tm!=cur_date) { // 每天凌晨４点钟触发一次
                log.info("凌晨４点的定时任务已触发");
                global.day_task_tm = cur_date;
                // start_cp('hot_skill.js');　　// 此处定时执行　'bin/crontab/hot_skill.js'脚本
            }
        }
        if (global.n%5==0){ // 每５分钟执行一次
            //  await check_video_status();
        }
    })().catch(err=>{
        log.error({data: err},"定时任务异常");
    });
}

function start_cp(name){
    child_process.spawn('node', [path.join(cp_dir,name)]).stdout.on('data',data=>{
        log.info(data+"");
    });
}