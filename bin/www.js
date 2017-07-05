#!/usr/bin/env node
"use strict"

require('./pre');
const app = require('../app');
const http = require('http');
const log = require('../libs/logger').tag('app');
const config = require('../config');
const util = require('../libs/utils');
const models = require('../models');
const child_process = require('child_process');

(async ()=>{

    let port = normalizePort(process.env.PORT || config.port || '3000');

    let server = http.createServer(app.callback());

    if (util.isProduction()){
      // TODO 生产环境下需要的操作
    }

    server.on('error', onError);
    server.on('listening', onListening);
    server.listen(port);
    log.info("服务启动");

    /**
     * Normalize a port into a number, string, or false.
     */
    function normalizePort(val) {
      var port = parseInt(val, 10);
      if (isNaN(port)) {
        return val;　// named pipe
      }
      if (port >= 0) {
        return port;　// port number
      }
      return false;
    }

    /**
     * Event listener for HTTP server "error" event.
     */
    function onError(error) {
      if (error.syscall !== 'listen') {
        throw error;
      }
      var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;
      switch (error.code) {　// handle specific listen errors with friendly messages
        case 'EACCES':
          log.error('bind' + ' requires elevated privileges');
          process.exit(1);
          break;
        case 'EADDRINUSE':
          log.error(bind + ' is already in use');
          process.exit(1);
          break;
        default:
          throw error;
      }
    }

    /**
     * Event listener for HTTP server "listening" event.
     */
    function onListening() {
      var addr = server.address();
      var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
      log.debug(process.pid + ' listening on ' + bind);
    }

    child_process.fork('bin/single.js');

})().catch(function(err) {
  log.error({data: err},"app 启动失败");
  process.exit(1);
});