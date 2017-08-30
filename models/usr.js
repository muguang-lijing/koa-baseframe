"use strict";
/**
 * 用户表
 * 用户不可删除
 */
const Sequelize = require('sequelize');
let tableName = 'usr';
module.exports = {
    tableName: tableName,
    cols: {
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV1,
            primaryKey: true,
            comment: '用户id,uuid'
        },
        name: {
            type: Sequelize.STRING(100),
            allowNull: false,
            comment: '用户名'
        },
        password: {
            type: Sequelize.STRING(100),
            allowNull: false,
            comment: '登陆密码'
        },
        role: {
            type: Sequelize.STRING(50),
            defaultValue: 'unknown',
            comment: '角色'
        },
        head_img: {
            type: Sequelize.STRING(255),
            allowNull: false,
            comment: '用户头像'
        },
        email: {
            type: Sequelize.STRING(100),
            allowNull: true,
            comment: '用户邮箱帐号'
        },
        time: {
            type: Sequelize.INTEGER,
            allowNull: false,
            comment: '用户的创建时间'
        }
    },
    sets: {
        timestamps: false,
        underscored: true,
        freezeTableName: false,
        tableName: tableName,
        indexes: [{
            fields: ["id"]
        }],
        classMethods: {
            getNum: async () => { // 获取用户总数
                return await this.count({ where: {} });
            },
             // 给某个字段增加值，field参数可以直接是字段名，也可以是对象，如: {name: 3, age: 5}
             // obj 是个对象，里面有两个可选参数，必填其一，优先使用row。{row -> 某行实例,where -> 查询条件}
            add_xx_num: async function (obj, field, trx) {
                let trans = trx && { transaction: trx } || null;
                if (obj.row){
                    var row = obj.row;
                }else{
                    var row = await this.findOne({where: obj.where});
                }
                if (row){
                    var out = await row.increment(field, trans);
                }else{
                    throw new Error(`表 ${tableName} 中找不到该记录，查询条件:`+JSON.stringify(obj.where));
                }
                return out;
            }
        }
    }
};