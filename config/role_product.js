/**
 *  用户角色配置
 */
'use strict';

module.exports = {
    "unknown": [
        { // 白名单，可访问 路由 GET : /test/roletest1
            method: ['GET'],
            include: [
                '/test/roletest1'
            ]
        },
        { // 白名单，可访问 路由 POST : /test/roletest2
            method: ['POST'],
            include: [
                '/test/roletest2'
            ]
        }
    ],
    "normal": [
        { // 白名单，可访问 test.js 路由文件下的所有路由
            method: ['GET','POST'],
            include: /^\/test.*/
        }
    ],
    "visitor": [
        { // 黑名单，不能访问所有的 POST 路由
            method: ['POST'],
            exclude: /.*/
        }
    ]
};