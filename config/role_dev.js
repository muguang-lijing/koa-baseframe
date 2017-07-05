/**
 *  用户角色配置
 */
'use strict';

/**
 * 游客角色配置
 */
const unknown = [
        { // 白名单，可访问 路由 GET : /test/roletest1
            method: ['GET'],
            include: /^\/test.*/
        },
        { // 白名单，可访问 路由 POST : /test/roletest2
            method: ['POST'],
            include: [
                '/test/roletest2'
            ]
        }
    ];

const normal = [
        { 
            method: ['GET','POST'],
            include: /^\/test.*/, // 白名单，可访问 test.js 路由文件下的所有路由
            exclude: /\/test\/savefile/ // 黑名单，禁止访问 /test/savefile 路由
        }
    ];

const visitor = [
        { // 黑名单，不能访问所有的 POST 路由
            method: ['POST'],
            exclude: /.*/
        }
    ];

const common = visitor.concat([ // 继承自visitor,增加了一个额外的规则，可以访问 POST '/test/roletest2'
        {
            method: ['POST'],
            include: [
                '/test/roletest2'
            ]
        }
    ]);

module.exports = {unknown,normal,visitor,common};