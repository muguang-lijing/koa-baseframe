"use strict";
/**
 * 首页banner表
 */
const Sequelize = require('sequelize');
const link_fields = require('../config/field_auto_update').banner || [];
const log = require('../libs/logger').tag('models-banner');
const auto = require('../libs/auto');
let tableName = 'banner';
module.exports = {
    tableName: tableName,
    cols: {
        id: {
            type: Sequelize.STRING(36),
            defaultValue: Sequelize.UUIDV1,
            primaryKey: true,
            comment: '表id'
        },
        type: {
            type: Sequelize.STRING(20),
            defaultValue: 'h5',
            comment: '类型，有 "h5"=> 跳至h5页面，"skill_video"=>跳至视频技能详情，"skill_graphic"=>跳至图文技能详情'
        },
        img_url: {
            type: Sequelize.STRING(255),
            allowNull: false,
            comment: '图片地址'
        },
        content_url: {
            type: Sequelize.STRING(255),
            allowNull: true,
            comment: '内容地址'
        },
        time: {
            type: Sequelize.STRING(255),
            defaultValue: 'df',
            comment: 'time'
        },
        order: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            comment: '该banner的顺序'
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
                    log.error({data: e},'事务执行失败');
                    throw new Error('Error: 事务执行失败:' + JSON.stringify(e));
                }
            }
        },

        freezeTableName: false,   
        classMethods: {
            // 给某个字段增加值，field参数可以直接是字段名，也可以是对象，如: {name: 3, age: 5}
            // obj 是个对象，里面有两个可选参数，必填其一，优先使用row。{row -> 某行实例,where -> 查询条件}
           add_xx_num: async function () {
               await this.create({
                img_url: 'jisdfjid======'
               });
               return "123";
           }
       },

        tableName: tableName
    }
};