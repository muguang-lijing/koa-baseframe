'use strict';

const fs = require('fs');
const path = require('path');
const config = require('../config');
const Sequelize = require('sequelize');
const logger = require('../libs/logger').tag('db');

const sequelize = new Sequelize(config.db_uri, {
    pool: {
        minConnections: 0,
        maxConnections: 5,
        maxIdleTime: 10000
    },
    logging: function (msg){
        logger.trace(msg);
    }
});

let models = {
    sequelize: sequelize,
    db: sequelize, // alias
    exec: function* (sql, args) { // 可直接执行原生sql语句
        var options = {replacements: args};
        var data = yield this.sequelize.query(sql, options);
        if (/select |returning/i.test(sql)) {
            return data[0];
        }
        return data[1];
    }
};

let fileList = fs.readdirSync(__dirname);
logger.trace(fileList);
let modelInfo_objs = {};
fileList.forEach(function(fileName) { // 除了index.js之外的所有文件都被认为是数据库模型文件
  if (fileName !== 'index.js' && fileName.indexOf('.js') !== -1) {
      let modelInfo = require('./'+fileName);
      models[modelInfo.tableName] = sequelize.define(modelInfo.tableName,modelInfo.cols,modelInfo.sets);
      modelInfo_objs[modelInfo.tableName] = modelInfo;
      logger.trace('defined model', modelInfo.tableName);
  }
});

models.modelInfos = modelInfo_objs;

module.exports = models;
