'use strict';

const config = require('../config');
const massive = require('mg-massive');
const monitor = require('pg-monitor');

/**
 * 
 * Increase the capacity that select the internal value of the JSONB field and can rename the selected field
I think this feature is necessary, and it's very common. I often need it on my projects.
 */

(async () => {
    let db = await massive(config.db_uri);
    monitor.attach(db.driverConfig);

    /**
     * 对普通字段进行更新，返回数组
     */
    await db.massive.update({
        'extra.comment[0] ilike': 'xxx%' 
    },{
        price: 290
    });

    /**
     * 这个函数更新的目标是JSONB或JSON列，查询模式和find函数一样
     * 如果查询条件的列是body列，则body可以省略，比如：本来是'body.name.first' 可以写成　'name.first'
     * 第二个参数是更新的目标对象，可以更新JSON列中的部分值而不用重新设置整个JSONB字段
     * 第三个参数是更新的列名，默认是'body'，如果要更新其他列，请显示设置第三个参数为要设置的列名
     */
    await db.massive.modify({
        'price >': '500'
    }, {"生产月份": 8},'attrs');

    console.log('ok');

})().catch(e => {
    console.error(e);
})