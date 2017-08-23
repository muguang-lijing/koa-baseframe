"use strict";

const bytes = require('bytes');
const utils = require('../libs/utils');
const logger = require('../libs/logger');
const createError = require('http-errors');
const config = require('../config');
const uuid = require('uuid');
const { role_sets } = config;

module.exports = {
  requestLogger: async (ctx,next) => {
    let start = Date.now();
    await next();
    let duration = Date.now() - start;
    let len = ctx.length;
    let length;
    // get the human readable response length
    if (~[204, 205, 304].indexOf(ctx.status)) {
      length = '';
    } else if (null == len) {
      length = '-';
    } else {
      length = bytes(len);
    }
    if (/^\/(activity|css|dist|fonts|js|src|text|res|img).*/.test(ctx.req.url)==false){
      let reqInfo = {
        duration: duration,
        uid: ctx.uid,
        req_url: ctx.req.url,
        req_type: ctx.req.method,
        req_cookie: ctx.req.headers.cookie,
        req_user_agent: ctx.req.headers["user-agent"],
        req_body: ctx.request.body,
        res_content_length: ctx.response.header["content-length"],
        res_content_type: ctx.response.header["content-type"],
        res_last_modified: ctx.response.header["last-modified"],
        res_status_code: ctx.res.statusCode, 
        res_body: ctx.body
      };
      ctx.log.info(reqInfo,"请求信息");
    }
  },
  errorHandler: async (ctx,next) => {  // 错误处理中间件
    try {
      await next();
    } catch (err) {
      if (err.status && err.status < 500) {
        logger.warn(err.stack || err);
      } else {
        logger.error(err.stack || err);
      }
      ctx.status = err.status || 500;
      let message = err.message || 'Internal Server Error';
      ctx.body = {code: ctx.status, err: JSON.stringify(message) || 'error', out: {}};
    }
  },
  defaultHandler: async (ctx,next) =>{ // 默认处理方式
    await next();
    if (ctx.path == '/' ){ // 根目录访问处理
      ctx.body = "Welcom to root";
    }else if (ctx.path == '/favicon.ico' ){　// 网站默认图标处理
      ctx.body = "";
    }else{
      if (ctx.body===undefined){　// 非法路由处理
        await ctx.render('web/404');
      }
    }
  },
  fixRequestBody: function* (next) { // 尝试将字符串值的字段转化为JSON对象
    if (this.method == "POST" && this.header["Content-Type"]!=='application/json') {
      let rbody = this.request.body;
      for (let k in rbody) { // 遍历所有键值，能转化为对象则转化，不能则不处理
        if (typeof rbody[k] == "string" && (~rbody[k].indexOf('{') || ~rbody[k].indexOf('['))) {
          try {
            rbody[k] = JSON.parse(rbody[k]);
          } catch (e) {
          }
        }
      }
    }
    yield next;
  },
  authControl: function* (next) { // 权限控制
    let cur_role = this.session.role || 'unknown';
    let role_config = role_sets[cur_role].cons;
    let isPass = false;
    if (role_config) {
      if (authFn(role_config, this.method, this.path)) {
        isPass = true;
      }
    }
    let public_api_config = role_sets['public_api'].cons;
    if (public_api_config && authFn(public_api_config, this.method, this.path)) {
      isPass = true;
    }
    if (isPass) {
      yield next;
    } else {
      this.throw('Unauthorized', 401);
    }
  },
  requestUuid: async (ctx,next) => {
      ctx.req_id = uuid.v1();
      ctx.log = logger.child({reqId:ctx.req_id});
      await next();
      ctx.set('ReqId', ctx.req_id);
  }
};

function authFn(auth_config, this_method, this_path) {
  for (let set of auth_config) {
    if (~set.method.indexOf(this_method)) {
      let cur_path = this_path;
      if (set.include) {
        if (Array.isArray(set.include)) {
          if (set.include.indexOf(cur_path) == -1) {
            continue;
          }
        } else if (set.include.test(cur_path) == false) {
          continue;
        }
      }
      if (set.exclude) {
        if (Array.isArray(set.exclude)) {
          if (~set.exclude.indexOf(cur_path)) {
            continue;
          }
        } else if (set.exclude.test(cur_path)) {
          continue;
        }
      }
      return true;
    }
  }
  return false;
}
