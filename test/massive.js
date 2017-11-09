'use strict';

const config = require('../config');
const massive = require('massive');
const monitor = require('pg-monitor');

(async ()=>{
    let db = await massive(config.db_uri);
    monitor.attach(db.driverConfig);
    let out = await db.run('select * from banner');
    console.log("out ok");
})().catch(e=>{
    console.error(e);
})
