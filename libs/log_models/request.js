"use strict";
/**
 * 请求日志信息表
 */
const Sequelize = require('sequelize');
const tableName = 'request';
module.exports = {
    tableName: tableName,
    cols: {
        id: {
            type: Sequelize.CHAR(36),
            primaryKey: true,
            comment: 'reqId'
        },
        uid: {
            type: Sequelize.CHAR(36),
            defaultValue: '',
            comment: '请求用户id'
        },
        url: {
            type: Sequelize.STRING(255),
            allowNull: false,
            comment: '请求的路由'
        },
        type: {
            type: Sequelize.STRING(4),
            allowNull: false,
            comment: '请求类型'
        },
        duration: {
            type: Sequelize.INTEGER,
            allowNull: false,
            comment: '请求耗时，单位毫秒'    
        },
        cookie: {
            type: Sequelize.STRING(255),
            defaultValue: '',
            comment: 'cookie'
        },
        user_agent: {
            type: Sequelize.STRING(255),
            defaultValue: '',
            comment: 'user_agent'
        },
        content_type: {
            type: Sequelize.STRING(50),
            defaultValue: '',
            comment: 'content_type'
        },
        body: {
            type: Sequelize.JSONB,
            allowNull: true,
            comment: '请求体'
        },
        res_content_type: {
            type: Sequelize.STRING(50),
            defaultValue: '',
            comment: 'res_content_type'
        },
        res_status_code: {
            type: Sequelize.INTEGER,
            allowNull: false,
            comment: '响应状态码'    
        },
        res_body: {
            type: Sequelize.TEXT,
            defaultValue: '',
            comment: '响应体'
        },
        time: {
            type: Sequelize.INTEGER,
            allowNull: false,
            comment: '时间，秒级时间戳'
        }
    },
    sets: {
        timestamps: false,
        underscored: true,
        freezeTableName: false,
        tableName: tableName,
        indexes: [{
            fields: ["uid","id"]
        }],
        classMethods: {
        }
    }
};