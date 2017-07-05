"use strict";

const Koa = require('koa');
const app = new Koa();
const json = require('koa-json');
const render = require('koa-art-template');
const session = require('koa-session');
const redisStore = require('koa-redis');
const parser = require('koa-body');
const serve = require('koa-static');
const config = require('./config');
const path = require('path');
const utils = require('./libs/utils');
const middlewares = require('./middlewares');
const load = require('./libs/load');

// global middlewares
app.use(middlewares.requestUuid);
app.use(middlewares.requestLogger);
app.use(middlewares.errorHandler);

app.use(serve(__dirname + '/public', {
  setHeaders: function(res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
    res.setHeader("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  }
}));

// session
app.keys = ['koa2'];
app.use(session({
    key: config.cookieKey, /** (string) cookie key (default is koa:sess) */
    maxAge: 5 * 365 * 24 * 60 * 60 * 1000, // cookie的过期时间为5年
    rolling: false,
    store:redisStore({
      host: config.redisSession.host,
      port: config.redisSession.port,
      db: config.redisSession.db,
      keySchema: config.sessionKey
    })
  },app));

app.use(middlewares.authControl);

render(app, {
  root: path.join(__dirname, 'views'),
  extname: '.htm',
  debug: !utils.isProduction()
});

app.use(parser({files: true, multipart: true, fields: true,formLimit: '10mb'})); 
app.use(json({pretty: !utils.isProduction()}));

app.use(middlewares.defaultHandler);
load(app, __dirname + '/routes');

module.exports = app;
