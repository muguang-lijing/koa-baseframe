"use strict"
const fs = require('fs');
const path = require('path');

if (!isProduction()){ // 是测试环境
    var config_file = '/dev.js';
}else{ // 是生产环境
    var config_file = '/product.js';
}
let config_dir = path.join(path.dirname(__dirname),'config');
let read_data =  fs.readFileSync(config_dir+config_file, 'utf8');
fs.writeFileSync(config_dir+'/index.js',read_data, 'utf8');

function isProduction(){ // 判断是否是生产环境
    return process.env.NODE_ENV === 'production';
}