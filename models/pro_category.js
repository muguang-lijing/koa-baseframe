"use strict";
/**
 * 商品分类表
 */
const Sequelize = require('sequelize');
const tableName = 'pro_category';
const log = require('../libs/logger').tag('models-'+tableName);
const util = require('util');
module.exports = {
    tableName: tableName,
    cols: {
        id: {
            type: Sequelize.STRING(100),
            allowNull: false,
            primaryKey: true,
            comment: 'uuid，同时也是分类名称'
        },
        odr: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            comment: '顺序'
        },
        extra: {
            type: Sequelize.JSONB,
            allowNull: true,
            comment: `额外的信息`
        },
        create_time: {
            type: Sequelize.INTEGER,
            allowNull: false,
            comment: '创建时间'
        }
    },
    sets: {
        timestamps: false,
        underscored: true,
        
        hooks: {
        },

        freezeTableName: false,
        tableName: tableName,
        indexes: [{
            fields: ["id"]
        }],
        classMethods: {
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
