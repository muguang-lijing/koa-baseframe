"use strict";
/**
 * massive模块测试表
 */
const Sequelize = require('sequelize');
const tableName = 'massive';
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
        weight: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            comment: '质量'
        },
        price: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            comment: '价格'
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
        },

        freezeTableName: false,
        tableName: tableName,
        indexes: [{
            fields: ["id"]
        }],
        classMethods: {
        }
    }
};
