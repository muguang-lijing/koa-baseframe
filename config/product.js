'use strict';
/**
 *  项目配置文件 ( 生产环境 )
 */
const Redis = require('ioredis');
const roles = require('./role_product');

const appName = 'koa2';  // 务必配置，改写成自己系统的名称
const host = "http://aabc.com";　　// 务必配置，系统主机地址
const host_doc = "http://aabc.com:3333";  // 务必配置，系统文档主机地址
const db_uri = "postgres://postgres:pg3110@127.0.0.1:5432/testdb1"; // 务必配置，业务数据库的连接字符串
const db_log_uri = "postgres://postgres:pg3110@127.0.0.1:5432/testdb_log"; // 务必配置，日志数据库的连接字符串

module.exports = {
    "port": 5002,  // 服务端口号
    "timeout": 30 * 20 * 1000,  // 路由响应的最大超时时间
    "db_uri": db_uri,　　
    "db_log_uri": db_log_uri,  
    "knex": require('knex')({ client: 'pg', connection: db_uri, pool: {min: 0, max: 7} }),
    "log": {  // 日志打印输出的日志级别，默认打印高于 debug 级别的日志（关于日志级别，具体可查　bunyan 日志包的文档）
        "level": "debug"
    },
    "role_sets": roles,　// 用户角色及权限配置（具体可参看 README.md ）
    "redis": new Redis({  // 业务逻辑使用的redis配置信息
        host: "127.0.0.1",
        port: 6379,
        db: "1"
    }),
    "redisSession": { 　// session 使用的redis配置信息
        host: "127.0.0.1",
        port: 6379,
        db: "7"
    },
    "default_file_save_path": "imgs",  // 默认的图片文件保存位置，为 public/static/imgs 
    "pw_salt": "xxx",
    "host": host,
    "host_doc": host_doc,
    "defaultUserHead": '/img/default_head.png', // 用户的默认头像
    "sessionKey": appName+"_app:sess",
    "cookieKey": appName+"_app:sess"
};