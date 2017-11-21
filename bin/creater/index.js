'use strict';
const models = require('../../models');
const code_creater = require('mg-code-creater');
const query_single_table = code_creater.query_single_table;
const insert_single_table = code_creater.insert_single_table;

// let out = query_single_table(models,'admin','product');
let out = insert_single_table('admin','product',{
    fields: {
        create_time: 'no',
        extra: 'u0'
    }
});

console.log(out);

process.exit(0);
