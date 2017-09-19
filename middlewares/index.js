"use strict";

const bytes = require('bytes');
const utils = require('../libs/utils');
const logger = require('../libs/logger');
const createError = require('http-errors');
const config = require('../config');
const routers_filter = require('../config/routers_filter');
const uuid = require('uuid');
const { role_sets } = config;

module.exports = {
  requestLogger: async (ctx, next) => {
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
    if (/^\/(activity|css|dist|fonts|js|src|text|res|img).*/.test(ctx.req.url) == false) {
      let reqInfo = {
        duration: duration,
        uid: ctx.uid,
        url: ctx.req.url,
        type: ctx.req.method,
        cookie: ctx.req.headers.cookie,
        user_agent: ctx.req.headers["user-agent"],
        content_type: ctx.req.headers["content-type"],
        body: ctx.request.body,
        // res_content_length: ctx.response.header["content-length"],
        res_content_type: ctx.response.header["content-type"],
        // res_last_modified: ctx.response.header["last-modified"],
        res_status_code: ctx.res.statusCode, 
        res_body: ctx.body
      };
      ctx.log.info(reqInfo, "请求信息");
    }
  },
  errorHandler: async (ctx, next) => {  // 错误处理中间件
    try {
      await next();
    } catch (err) {
      if (err.status && err.status < 500) {
        logger.warn(err.stack || err);
      } else {
        logger.error(err.stack || err);
      }
      ctx.status = err.status || 500;
      let message = 'Internal Server Error', code = -1;
      if (err.message) {
        if (err.message.indexOf(';;')) {
          let msgs = err.message.split(';;');
          message = msgs[0];
          code = msgs[1];
        } else {
          message = JSON.stringify(err.message);
        }
      }
      ctx.body = { err: { code, msg: message }, out: {} };
    }
  },
  defaultHandler: async (ctx, next) => { // 默认处理方式
    await next();
    if (ctx.path == '/') { // 根目录访问处理
      ctx.body = "Welcom to root";
    } else if (ctx.path == '/favicon.ico') {　// 网站默认图标处理
      ctx.body = "";
    } else {
      if (ctx.body === undefined) {　// 非法路由处理
        await ctx.render('web/404');
      }
    }
  },
  fixRequestBody: async (ctx, next) => { // 尝试将字符串值的字段转化为JSON对象
    if (ctx.method == "POST" && ctx.header["Content-Type"] !== 'application/json') {
      let rbody = ctx.request.body;
      for (let k in rbody) { // 遍历所有键值，能转化为对象则转化，不能则不处理
        if (typeof rbody[k] == "string" && (~rbody[k].indexOf('{') || ~rbody[k].indexOf('['))) {
          try {
            rbody[k] = JSON.parse(rbody[k]);
          } catch (e) {
          }
        }
      }
    }
    await next();
  },
  checkParams: async (ctx, next) => { // 路由参数过滤
    let cur_rinfo = routers_filter[ctx.path];
    if (cur_rinfo) {
      let query = ctx.query;
      if (ctx.method == "POST") { // get请求方式只适用于　required,default,enum,limit 这四个限制属性
        query = ctx.request.body;
      }
      let doc_str = `，接口文档：` + config.host_doc + `/#api-${cur_rinfo.apiGroup}-${cur_rinfo.apiName}`;
      for (let p of cur_rinfo.apiParams) {
        let pname = p.name; // 当前参数名
        // 检查 default 属性
        if (query[pname] == undefined && p.default !== undefined) {
          query[pname] = p.default;
        }
        // 检查 required 属性
        if (p.required) {
          if (query[pname] === undefined) {
            ctx.throw(`参数 ${pname} 必传${doc_str};;1`, 200); return;
          }
        } else if (query[pname] === undefined) {
          continue;
        }
        // 检查 type 属性
        if (ctx.method == "POST") { // 只需检查post方式，因为get方式的参数都是字符串类型
          let err = false;
          if (p.type == "array") {
            if (Array.isArray(query[pname]) == false) {
              err = true;
            }
          } else if (typeof query[pname] !== p.type) {
            err = true;
          }
          if (err) {
            ctx.throw(`参数 ${pname} 类型错误${doc_str};;1`, 200); return;
          }
        }
        if (p.max !== undefined) {
          if (query[pname] > p.max) {
            ctx.throw(`参数 ${pname} 的值已超过最大值：${p.max} ${doc_str};;1`, 200); return;
          }
        }
        if (p.min !== undefined) {
          if (query[pname] < p.min) {
            ctx.throw(`参数 ${pname} 的值已小于最小值：${p.min} ${doc_str};;1`, 200); return;
          }
        }
        if (p.vtype !== undefined) {
          if (query[pname].every(v => typeof v == p.vtype) == false) {
            ctx.throw(`参数 ${pname} 的数组元素类型不符合要求，数组元素值类型应为：${p.vtype} ${doc_str};;1`, 200); return;
          }
        }
        if (p.enum !== undefined) {
          if (p.enum.indexOf(query[pname]) == -1) {
            ctx.throw(`参数 ${pname} 的值不在要求的枚举值中间：${[...p.enum]} ${doc_str};;1`, 200); return;
          }
        }
        if (p.okeys !== undefined) {
          for (let k of p.okeys) {
            let kr = k.split('<');
            let curov = query[pname][kr[0]];
            if (!curov) {
              ctx.throw(`参数 ${pname} 的值缺少必有字段：${k} ${doc_str};;1`, 200); return;
            }
            if (kr[1] && typeof curov !== kr[1].slice(0, -1)) {
              ctx.throw(`参数 ${pname} 的值中的字段 ${kr[0]} 的类型不符合要求 ${doc_str};;1`, 200); return;
            }
          }
        }
        if (p.limit !== undefined) {
          if (query[pname].length > p.limit) {
            ctx.throw(`参数 ${pname} 的值的长度已超过限长：${p.limit} ${doc_str};;1`, 200); return;
          }
        }
        if (p.shortest !== undefined) {
          if (query[pname].length < p.shortest) {
            ctx.throw(`参数 ${pname} 的值的长度不满足最短长度要求：${p.shortest} ${doc_str};;1`, 200); return;
          }
        }
      }
    }
    await next();
  },
  authControl: async (ctx, next) => { // 权限控制
    let cur_role = ctx.session.role ||  'unknown';
    let role_config = role_sets[cur_role].cons;
    let isPass = false;
    if (role_config) {
      if (authFn(role_config, ctx.method, ctx.path)) {
        isPass = true;
      }
    }
    let public_api_config = role_sets['public_api'].cons;
    if (public_api_config && authFn(public_api_config, ctx.method, ctx.path)) {
      isPass = true;
    }
    if (isPass) {
      await next();
    } else {
      ctx.throw('Unauthorized', 401);
    }
  },
  requestUuid: async (ctx, next) => {
    ctx.req_id = uuid.v1();
    ctx.log = logger.child({ reqId: ctx.req_id });
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
