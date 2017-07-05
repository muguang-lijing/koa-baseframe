"use strict";

const Router = require('koa-router');
const router = new Router();
const log = require('./logger').tag('load');
const rindex = require('../routes');
const path = require('path');
const fs = require('fs');
const join = path.resolve;
const readdir = fs.readdirSync;

module.exports = function(app, root) {
    readdir(root).forEach(function(file) {
        let dir = join(root, file);
        let stats = fs.lstatSync(dir);
        if (stats.isFile()) {
            let conf = require(dir);
            if (typeof conf.routes === 'function') {
                if (file == "index.js") {
                    router.use(rindex.routes());
                } else {
                    router.use('/' + file.slice(0, -3), conf.routes());
                }
            }
        }
    });
    app.use(router.routes()).use(router.allowedMethods());
    log.debug('Finish loading routes.');
};