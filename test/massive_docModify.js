'use strict';

const config = require('../config');
const massive = require('mg-massive');
const monitor = require('pg-monitor');

(async () => {
    let db = await massive(config.db_uri);
    monitor.attach(db.driverConfig);

    /**
     * modify用于修改文档，与saveDoc方法的区别在于：该方法可以直接修改文档中的个别字段，而不用重设整个文档
     */

    // let out = await db.reports.modify(2,{  // 根据id修改
    //     extra: '666666'
    // });
    let out = await db.reports1.modify({ 
        'content.lists[1] >': 30
    },{
        extra: 'extraji77777777'
    });
    console.log("out: \n"+JSON.stringify(out,null,4));
    
})().catch(e => {
    console.error(e);
})