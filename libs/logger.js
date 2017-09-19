'use strict';

const bunyan = require('bunyan');
const utils = require('./utils');
const path = require('path');
const fs = require('fs');
const child_process = require('child_process');

var logProcess = child_process.spawn('node', [path.join(utils.baseDir(),'bin/log.js')]);

let timer0 = setInterval(async ()=>{
  try{
    await utils.write_2_stream(logProcess.stdin,"##ok##");
    // console.log("========= 主进程供血成功");
  }catch(e){
    // console.log("========= log 子进程　已死，主进程停止供血");
    clearInterval(timer0);
  }
},7000);

logProcess.stdout.on('data', function (data) {
  console.log(data+"");
});

logProcess.stderr.on('data', function (data) {
  console.error(data+"");
});

var logger = bunyan.createLogger({
  name: "koa2",
  level: "debug", // 默认是 info
  stream: logProcess.stdin,
  src: true,  // 日志中是否显示源码位置
  serializers: bunyan.stdSerializers
});

logger.tag = function(option) {
  if (typeof option === 'string') {
    option = {tag: option};
  }
  return logger.child(option);
};

module.exports = logger;
