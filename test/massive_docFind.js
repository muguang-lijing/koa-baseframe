'use strict';

const config = require('../config');
const massive = require('mg-massive');
const monitor = require('pg-monitor');

(async () => {
    let db = await massive(config.db_uri);
    monitor.attach(db.driverConfig);

    // let out = await db.reports.findDoc(); // 全部查询
    // let out = await db.reports.findDoc(2); // 根据主键(id)，查询
    let out = await db.reports.findDoc({ 
        'content.lists[1] >': 20
    });
    console.log("out: \n"+JSON.stringify(out,null,4));
    
})().catch(e => {
    console.error(e);
})