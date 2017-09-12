"use strict"
/**
 * 一些通用可复用逻辑
 */
const models = require('../models');
const path = require('path');
const uuid = require('uuid');
const mime = require('mime');
const utils = require('../libs/utils');
const fs = require('fs');
const config = require('../config');
const log = require('../libs/logger').tag('common');

/**
 * 保存二进制文件到本地，并且返回相关信息对象，结构为：
 * {
 *     access_path, => 文件相对路径，相对于 '/public'，注意，当传入绝对路径时
 *     aim_path     => 文件的绝对路径
 * }
 * 如果出现重名则会直接覆盖
 * @param {object} file 路由里面接收到的文件对象
 * @param {object} option 其他选项:
 *  option.max_size {number} => 文件最大大小限制（单位bytes），默认不限制
 *  option.name {string} => 保存的文件名，默认采用uuid
 *  option.name_is_with_fux {boolean} => 文件名是否包含后缀，当有name参数的时候起效，默认不包含
 *  option.save_path {string} => 文件保存路径，相对于public/res，默认取配置文件
 *  option.save_path_is_absolute {boolean} => 文件路径是否是绝对路径，默认 false 
 */
async function saveFile(file,option={}) {
    if (option.max_size && file.size > option.max_size){
        return "文件过大";
    }
    let fileName = uuid.v1();
    let fux = '.'+mime.extension(file.type);
    if (fux=='.undefined'){
        fux = file.name.slice(file.name.indexOf('.'));
    }
    if (option.name){
        fileName = option.name;
        if (option.name_is_with_fux) { fux = ""; }
    }
    let file_save_path = config.default_file_save_path;
    if (option.save_path){
        file_save_path = option.save_path;
    }
    let aim_path,access_path;
    if (option.save_path_is_absolute){
        aim_path = path.join(file_save_path,fileName + fux);
    }else{
        access_path = path.join('/res', file_save_path , fileName + fux);
        aim_path = path.join(utils.baseDir(), 'public', access_path);
    }
    await utils.pipeSync(fs.createReadStream(file.path),fs.createWriteStream(aim_path));
    return { access_path, aim_path, access_full_path: path.join(config.host,access_path) };
}

module.exports = {
    saveFile
};