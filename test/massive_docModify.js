'use strict';

const config = require('../config');
const massive = require('massive');
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
    let out = await db.reports.modify({ 
        'content.lists[0] >': 30
    },{
        extra: '9999999'
    });
    console.log("out: \n"+JSON.stringify(out,null,4));
    
})().catch(e => {
    console.error(e);
})