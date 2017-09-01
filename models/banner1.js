"use strict";
/**
 * 首页banner表
 * // TODO next 增加技能分类，用户只能看到他关注的分类下的baner
 */
const Sequelize = require('sequelize');
let tableName = 'banner1';
module.exports = {
    tableName: tableName,
    cols: {
        id: {
            type: Sequelize.STRING(36),
            defaultValue: Sequelize.UUIDV1,
            primaryKey: true,
            comment: '表id'
        },
        head: {
            type: Sequelize.STRING(255),
            defaultValue: '',
            comment: '图片地址'
        },
        id_f_banner: {
            type: Sequelize.STRING(36),
            defaultValue: '',
            comment: 'banner表id'
        },
        img_url_f_banner: {
            type: Sequelize.STRING(255),
            allowNull: false,
            comment: '图片地址'
        },
        time: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            comment: 'time'
        },
        order_f_banner: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            comment: '该banner的顺序'
        }
    },
    sets: {
        timestamps: false,
        underscored: true,
        freezeTableName: false,
        tableName: tableName,
        hooks: {
        }
    }
};
