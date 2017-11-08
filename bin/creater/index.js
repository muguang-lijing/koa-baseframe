'use strict';
const models = require('../../models');
const { query_single_table } = require('mg-code-creater');

let out = query_single_table(models,'admin','product');

console.log(out);

process.exit(0);
