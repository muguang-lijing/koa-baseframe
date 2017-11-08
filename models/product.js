"use strict";
/**
 * 商品信息表
 */
const Sequelize = require('sequelize');
const tableName = 'product';
const log = require('../libs/logger').tag('models-'+tableName);
const util = require('util');
module.exports = {
    tableName: tableName,
    cols: {
        id: {
            type: Sequelize.CHAR(36),
            defaultValue: Sequelize.UUIDV1,
            primaryKey: true,
            comment: 'uuid'
        },
        name: {
            type: Sequelize.STRING(150),
            allowNull: false,
            comment: '商品名称'
        },
        id_f_pro_category: {
            type: Sequelize.STRING(100),
            allowNull: false,
            comment: '所属分类'
        },
        id_f_pro_brand: {
            type: Sequelize.STRING(60),
            allowNull: false,
            comment: '所属品牌'
        },
        intro: {
            type: Sequelize.STRING(520),
            defaultValue: '',
            comment: '简介'
        },
        title_url: {
            type: Sequelize.STRING(255),
            defaultValue: '',
            comment: '列表中的标题预览图'
        },
        pics: {
            type: Sequelize.ARRAY(Sequelize.STRING(255)),
            allowNull: true,
            comment: '展示图片'
        },
        attrs: {
            type: Sequelize.JSONB,
            allowNull: true,
            comment: `一些属性（不固定），如：
            {
                "用量": "每日３次，每次１片",
                "禁忌": "孕妇禁用"
            }`
        },
        mobile_html: {
            type: Sequelize.TEXT,
            defaultValue: '',
            comment: '移动端商品详情'
        },
        pc_html: {
            type: Sequelize.TEXT,
            defaultValue: '',
            comment: 'PC端商品详情'
        },
        is_show: {
            type: Sequelize.BOOLEAN,
            defaultValue: true,
            comment: '是否上架'
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
        
            afterUpdate: async function (ts, options) {
                const models = require('../models');
                let t = options.transaction;
                let trx = t || (await models.sequelize.transaction());
                try {
                    await auto.udaterfield(models,tableName,link_fields,ts.dataValues,ts._changed,trx);   // { transaction: trx } 
                    /********************用户代码段开始*********************/

                    // TODO 后续逻辑代码
                    // 注：　trx　事务对象一定存在，若不需要事务，可以不使用trx

                    /********************用户代码段结束*********************/
                    t || (await trx.commit());
                } catch (e) {
                    t || (await trx.rollback());
                    e = util.format('%o',e);
                    log.error({data: e},'事务执行失败');
                    throw new Error('Error: 事务执行失败: \n' + e);
                }
            }
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
