/**
 *  用户角色配置
 */
'use strict';

const public_api = { // 所有角色都可以访问的api
    des: '公共api',
    cons: [
        {
            method: ['GET', 'POST'],
            include: /^\/(favicon\.ico|activity|css|dist|fonts|img|js|res|src|text|backstage|zhima|test|login|tencent|mp-wx|pay|wxshare).*/,
            exclude: [
                '/login/resetCategorys'
            ]
        },
        {
            method: ['POST','GET'],
            include: [
                '/',
                '/skill/cb',
                '/skill/info',
                '/skill/extra_info',
                '/skill/skill_buyers',
                '/act/share_act/info',
                '/act/share_act_buyers',
                '/act/interests_act/info',
                '/act/interests_act_buyers',
                '/xadmin/find_users',
                '/user/my_skills',
                '/user/info',
                '/home/usrs_by_random',
                '/xadmin/admin_login',
                '/xadmin/admin_verify'
            ]
        }
    ]
};

const unknown = {
    des: '游客用户',
    cons: [
        { // 白名单，可访问 路由 POST : /test/roletest2
            method: ['POST','GET'],
            include: [
                '/test/roletest2',
                '/test/testconfigroel',
                '/act/interests_act/info',
                '/act/share_act/info'
            ]
        },
        { // 白名单，可访问 路由 POST : /test/roletest2
            method: ['POST','GET'],
            include: /^\/(other|act|withdraw).*/
        },
        {
            method: ['GET', 'POST'],
            include: [
                '/skill/info',
                '/other/upload_img',
                '/other/a',
                '/other/getcategories',
                '/other/upload_imgs',
                '/act/share_act/add',
                '/act/share_act/get',
                '/act/share_act/del',
                '/xadmin/get_categorys',
                'get_moneylist'
            ],
            exclude: [
                '/login/setCategorys',
                '/login/resetCategorys',
                '/login/unfollowCategory'
            ]
        }
    ]
};

const usr_normal = {
    des: '普通用户',
    cons: [
        {
            method: ['GET', 'POST'],
            include: /.*/
        },
        {
            method: ['GET','POST'],
            include: [
                '/login/setCategorys',
                '/login/resetCategorys',
                '/login/unfollowCategory',
                '/withdraw/review'       
            ]
        }
    ]
};

const usr_star = {
    des: '达人用户',
    cons: [
        { // 黑名单，不能访问所有的 POST 路由
            method: ['GET','POST'],
            include: /.*/
        }
    ]
};

const usr_gold = {
    des: '大咖用户',
    cons: usr_star.cons.concat([ // 继承自 usr_star
        {
            method: ['POST'],
            include: [
                '/test/roletest2'
            ]
        }
    ])
};

const usr_org = {
    des: '机构用户',
    cons: [
        { // 黑名单，不能访问所有的 POST 路由
            method: ['POST'],
            include: /.*/
        }
    ]
};

const admin_operate = {
    des: '运营管理员', // 拥有运营部分所有接口和用户和技能的查看接口
    cons: [
        {
            method: ['GET'],
            include: /.*/
        }
    ]
};

const admin_normal = {
    des: '普通管理员', // 拥有所有的查看权限
    cons: [
        {
            method: ['GET'],
            include: /.*/
        }
    ]
};

const admin_super = {
    des: '超级管理员',
    cons: [
        {
            method: ['POST','GET'],
            include: /.*/,
            exclude: [
                '/xadmin/create',
                '/xadmin/freeze',
                '/xadmin/delete',
                '/xadmin/all_admin',
                '/xadmin/get_admin_roles'     
            ]
        }
    ]
};

const admin_root = {
    des: '根管理员',
    cons: [
        { // 黑名单，不能访问所有的 POST 路由
            method: ['POST','GET'],
            include: [
                '/xadmin/create',
                '/xadmin/freeze',
                '/xadmin/delete',
                '/xadmin/all_admin',
                '/xadmin/get_admin_roles'
            ]
        }
    ]
};

module.exports = {
    public_api,
    unknown,
    usr_normal,
    usr_star,
    usr_gold,
    usr_org,
    admin_normal,
    admin_operate,
    admin_super,
    admin_root,
    find_role_des: function(role_name){
        for(let k in this){
            if (typeof this[k]=="object"){
                if (k==role_name){
                    return this[k].des;
                }
            }
        }
    }
};