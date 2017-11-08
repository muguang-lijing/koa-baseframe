'use strict';

const bunyan = require('bunyan');
const utils = require('mg-utils');
const path = require('path');
const fs = require('fs');
const child_process = require('child_process');

let log_option = {
  name: "koa2",
  level: "debug", // 默认是 info
  src: true,  // 日志中是否显示源码位置
  serializers: bunyan.stdSerializers
};

if (utils.isProduction()){
  var logProcess = child_process.spawn('node', [path.join(utils.baseDir(),'bin/log.js')]);
  log_option.stream = logProcess.stdin;
  var timer0 = setInterval(async ()=>{
    try{
      await utils.write_2_stream(logProcess.stdin,"##ok##");
      // console.log("========= 主进程供血成功");
    }catch(e){
      // console.log("========= log 子进程　已死，主进程停止供血:\n"+JSON.stringify(e,nulll,4));
      clearInterval(timer0);
    }
  },7000);
  
  logProcess.stdout.on('data', function (data) {
    console.log(data+"");
  });
  
  logProcess.stderr.on('data', function (data) {
    console.error(data+"");
  });
}

var logger = bunyan.createLogger(log_option);

logger.tag = function(option) {
  if (typeof option === 'string') {
    option = {tag: option};
  }
  return logger.child(option);
};

module.exports = logger;
