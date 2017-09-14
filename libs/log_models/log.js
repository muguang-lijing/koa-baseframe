"use strict";
/**
 * 基本log信息表
 */
const Sequelize = require('sequelize');
const tableName = 'log';
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
            type: Sequelize.STRING(50),
            allowNull: false,
            comment: '日志名称'
        },
        hostname: {
            type: Sequelize.STRING(50),
            allowNull: false,
            comment: '主机名称'
        },
        pid: {
            type: Sequelize.INTEGER,
            allowNull: false,
            comment: '进程号'
        },
        tag: {
            type: Sequelize.STRING(25),
            defaultValue: '',
            comment: '标签'
        },
        level: {
            type: Sequelize.INTEGER,
            allowNull: false,
            comment: '日志级别'
        },
        data: {
            type: Sequelize.JSONB,
            allowNull: true,
            comment: '日志主要数据'
        },
        msg: {
            type: Sequelize.TEXT,
            defaultValue: '',
            comment: '日志概要信息'
        },
        src: {
            type: Sequelize.JSONB,
            allowNull: true,
            comment: '日志源码信息'
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
            fields: ["tag","id"]
        }],
        classMethods: {
        }
    }
};