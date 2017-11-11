'use strict';

const config = require('../config');
const massive = require('massive');
const monitor = require('pg-monitor');

(async () => {
    let db = await massive(config.db_uri);
    monitor.attach(db.driverConfig);

    /**
     * 根据任意条件进行删除
     * 返回的结果是数组，所有删除记录的对象数组
     */
    let out = await db.massive.destroy({
        'attrs.产地': '陕西' 
    }
    // ,{only: true}　　// 该only选型用于防止其影响到其他表，就是只删除该表记录，而不管其他与之相关的表
    );

    console.log('ok :\n'+JSON.stringify(out,null,4));

})().catch(e => {
    console.error(e);
})