"use strict";

const crypto = require('crypto');
const path = require('path');
const config = require('../config');
const moment = require('moment');
const fs = require('fs');

module.exports = {
  md5: function (text) { // md5 加密签名(加盐)
    return crypto.createHash('md5').update(text+config.pw_salt).digest('hex');
  },
  timeShow: function (v,format){ // 将数据库的时间戳值展示为易读的值
    let time_format = format || 'YYYY-MM-DD HH:mm';
    return moment.unix(v).format(time_format);
  },
  time: function (){  // 返回　unix 时间戳
    return moment().unix();
  },
  isEmail: function (str) { // 邮箱格式校验
    return /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(str);
  },
  isPhoneNumber: function (str) { // 电话号码校验
    return /^1\d{10}$/gi.test(str);
  },
  createRandomCode: function (len){ // 生成指定长度的数字串（有可能重复）
    let code = "";
    for (var i = 0; i < len; i++) {
        code += Math.floor(Math.random() * 10);
    }
    return code;
  },
  fillnum: function (num,n){ // 将一个数字转化成指定长度的字符串，若不够，则前面补0
    var ar = num.toString().split('');
    var br = [];
    for (var i=ar.length; i< n; i++){
        br.push('0');
    } 
    return br.concat(ar).join('');
  },
  getStreamToStr : function(stream){ // 将一个流转化为字符串
    let str = '';
    stream.on('data',thunk=>{
      str += thunk;
    });
    return new Promise((resolve)=>{
      stream.on('end',()=>{
        resolve(str);
      });
    });
  },
  delay: function (time){ // 延迟指定毫秒
    return new Promise(resolve=>{
      setTimeout(()=>{
        resolve();
      },time);
    });
  },
  cpfile2dir: function (file_path,dir,cb){ // 复制一个文件到指定的目录,如果最后一个参数不传，则返回Promise
    let promise =  new Promise(resolve=>{
      let aim_path = path.join(dir,path.basename(file_path));
      fs.access(file_path,err=>{
        if (!err){ // 如果文件存在，则复制
          let wstream = fs.createWriteStream(aim_path);
          wstream.on('close',()=>{
            cb ? cb(true) : resolve(true);
          });
          fs.createReadStream(file_path).pipe(wstream);
        }else{
          cb ? cb(false) : resolve(false);
        }
      });
    });
    return cb ? "" : promise;
  },
  down2dir,
  pipeSync: function (rstream,wstream){  // pipe 的同步方法
    return new Promise((resolve)=>{
      let flag = 0;
      function closeFn(){
        flag++;
        if (flag==2){ // 只有当两个流都关闭的时候才真正返回
          resolve();
        }
      }
      rstream.on('close',closeFn);
      wstream.on('end',()=>{
        wstream.end();
      });
      wstream.on('close',closeFn);
      rstream.pipe(wstream);
    });
  },
  baseDir: function () { // 获取项目的根路径
    return path.dirname(__dirname);
  },
  /**
   * 获取 [a,b) 之间的随机整数
   */
  getRandomNum: function(a, b) { 
      let Range = b - a - 1; 
      let Rand = Math.random(); 
      return (a + Math.round(Rand * Range)); 
  },
  getRd: function(){
      return parseInt(Date.now()/3600000).toString(2);
  },
  add,sub,mul,div,
  hbs: require('./hbs'),
  //logger: require('./logger'),
  isProduction: () => { // 判断是否是生产环境
    return process.env.NODE_ENV === 'production';
  }
};

/**
 * 精确加法
 */
function add(a, b) {
    var c, d, e;
    try {
        c = a.toString().split(".")[1].length;
    } catch (f) {
        c = 0;
    }
    try {
        d = b.toString().split(".")[1].length;
    } catch (f) {
        d = 0;
    }
    return e = Math.pow(10, Math.max(c, d)), (mul(a, e) + mul(b, e)) / e;
}

/**
 * 精确减法
 */
function sub(a, b) {
    var c, d, e;
    try {
        c = a.toString().split(".")[1].length;
    } catch (f) {
        c = 0;
    }
    try {
        d = b.toString().split(".")[1].length;
    } catch (f) {
        d = 0;
    }
    return e = Math.pow(10, Math.max(c, d)), (mul(a, e) - mul(b, e)) / e;
}

/**
 * 精确乘法
 */
function mul(a, b) {
    var c = 0,
        d = a.toString(),
        e = b.toString();
    try {
        c += d.split(".")[1].length;
    } catch (f) {}
    try {
        c += e.split(".")[1].length;
    } catch (f) {}
    return Number(d.replace(".", "")) * Number(e.replace(".", "")) / Math.pow(10, c);
}

/**
 * 精确除法
 */
function div(a, b) {
    var c, d, e = 0,
        f = 0;
    try {
        e = a.toString().split(".")[1].length;
    } catch (g) {}
    try {
        f = b.toString().split(".")[1].length;
    } catch (g) {}
    return c = Number(a.toString().replace(".", "")), d = Number(b.toString().replace(".", "")), mul(c / d, Math.pow(10, f - e));
}

/**
 * 下载一个文件到指定的目录，返回Promise
 * @param {string} url 下载的地址链接 
 * @param {string} dir 下载目录路径（绝对路径） 
 */
function down2dir(url,dir,tm){
    let trytm = tm || 0;
    return new Promise(resolve=>{
      let http = require('http');
      if (url.slice(0,5)=='https'){
        http = require('https');
      }
      let clientReq = http.get(url,res=>{
        let fileName = path.basename(url);
        let aimpath = path.join(dir,fileName);
        let wstream = fs.createWriteStream(aimpath);
        wstream.on('close',()=>{
          resolve('close');
        });
        res.pipe(wstream);
      });
      clientReq.on('aborted',()=>{
        resolve('aborted');
      });
      clientReq.setTimeout(30000, ()=>{
        if (trytm<3){
          download2dir(url,dir,trytm+1);
        }else{
          resolve('timeout');
        }
      });
    });
  }