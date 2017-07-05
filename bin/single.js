'use strict';
const uuid = require('uuid');
const fs = require('fs');
const path = require('path');
const tempdir = path.join('public/res/temp','temp1');

(async ()=>{
    try {
        fs.accessSync(tempdir);
        process.exit(0);
    }catch(e){
        fs.writeFileSync(tempdir,'hehe');
    }
    setTimeout(()=>{
        fs.unlinkSync(tempdir);
    },3000);
    await main();
})().catch(err=>{
    console.error(err);
    process.exit(1);
});

/**
 * 该函数中的代码只会执行一次
 */
async function main(){

    const loop = require('./crontab');

    setInterval(loop,1000*60); // 定时器每间隔１分钟触发一次
    global.n = 0;
    global.day_task_tm = new Date().getDate();

    fs.writeFileSync('public/res/temp/testpro'+uuid.v1()+'.txt',"hehe");
    console.log("single start");
}