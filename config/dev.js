/**
 *  项目配置文件 ( 测试环境 )
 */
const Redis = require('ioredis');
const roles = require('./role_dev');
"use strict";
module.exports = {
    "port": 5000,
    "timeout": 30 * 20 * 1000,
    "db_uri": "postgres://dbuser:password@host/db_name",
    "db_log_uri": "mongodb://localhost:27017/koa2_logs",
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
    "host": "http://aabc.com",  //后面不能加斜杠
    "defaultUserHead": '/img/default_head.png', // 用户的默认头像
    "sessionKey": "koa2_app:sess",
    "cookieKey": "koa2_app:sess"
};