"use strict"
const fs = require('fs');
const path = require('path');
const baseDir = path.dirname(path.dirname(__dirname));
const child_process = require('child_process');

if (!isProduction()){ // 是测试环境
    var config_file = '/dev.js';
}else{ // 是生产环境
    var config_file = '/product.js';
}
let config_dir = path.join(baseDir,'config');
let read_data =  fs.readFileSync(config_dir+config_file, 'utf8');
fs.writeFileSync(config_dir+'/index.js',read_data, 'utf8');

function isProduction(){ // 判断是否是生产环境
    return process.env.NODE_ENV === 'production';
}

try {
    fs.unlinkSync(path.join(baseDir,'public/res/temp/temp1')); // 删掉控制单进程执行的临时文件
}catch(e){}

require('./check_files');
require('./create_routers_filter');
require('./create_db_field_auto_change_code');

let std_out = child_process.execSync(`apidoc -i routes/ -o public/apidoc/`);
console.log();
console.log("接口文档已生成：");
console.log(std_out+"");
