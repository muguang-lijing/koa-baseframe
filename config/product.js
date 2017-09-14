'use strict';
/**
 *  项目配置文件 ( 测试环境 )
 */
const Redis = require('ioredis');
const roles = require('./role_product');

const host = "http://aabc.com"; // 系统主机地址
const host_doc = "http://aabc.com:3333";　// 系统文档主机地址

module.exports = {
    "port": 5000,
    "timeout": 30 * 20 * 1000,
    "db_uri": "postgres://postgres:pg3110@127.0.0.1:5432/testdb1",
    "db_log_uri": "postgres://postgres:pg3110@127.0.0.1:5432/testdb_log",
    "log": {
        "level": "debug"
    },
    "role_sets": roles,
    "redis": new Redis({
        host: "127.0.0.1",
        port: 6379,
        db: "1"
    }),
    "redisSession": { // session 使用的redis
        "host": "127.0.0.1",
        "port": 6379,
        "db": "7"
    },
    "default_file_save_path": "imgs",
    "pw_salt": "xxx",
    "host": host,  //后面不能加斜杠
    "host_doc": host_doc,
    "defaultUserHead": '/img/default_head.png', // 用户的默认头像
    "sessionKey": "koa2_app:sess",
    "cookieKey": "koa2_app:sess"
};