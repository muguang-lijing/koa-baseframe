'use strict';

const config = require('../config');
const massive = require('massive');
const monitor = require('pg-monitor');

(async () => {
    let db = await massive(config.db_uri);
    monitor.attach(db.driverConfig);

    await db.massive.modify({
        'extra.comment[0] ilike': 'xxx%'
    }, {
        '备注': '真的牛逼阿。。'
    },'extra');

    console.log('ok');

})().catch(e => {
    console.error(e);
})