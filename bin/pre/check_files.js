"use strict"
/**
 * 检查必要的文件是否存在，如果不存在则创建
 */
const fs = require('fs');
const path = require('path');
const baseDir = path.dirname(path.dirname(__dirname));

let base_config_file = 'dev.js';
if (isProduction()){
    base_config_file = 'product.js';
}

const config_dir = path.join(baseDir,'config');

const config_index_path = path.join(config_dir,'index.js');

if (!fs.existsSync(config_index_path)){
    fs.copyFileSync(path.join(config_dir,base_config_file), config_index_path);
}

const config_need_files = [
    {
        name: 'field_auto_update.js',
        text: `'use strict';
    /**
    * 模型字段自动更新的配置文件
    */
    module.exports = {
    }`
    },
    {
        name: 'routers_filter.js',
        text: `'use strict';
    /**
    * 路由参数过滤器的配置文件
    */
    module.exports = {
    }`
    }
];

for (let f of config_need_files){
    const config_f_path = path.join(config_dir,f.name);
    if (!fs.existsSync(config_f_path)){
        fs.writeFileSync(config_f_path,f.text);
    }   
}

function isProduction(){ // 判断是否是生产环境
    return process.env.NODE_ENV === 'production';
}
