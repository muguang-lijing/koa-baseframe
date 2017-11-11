'use strict';

const config = require('../config');
const massive = require('massive');
const monitor = require('pg-monitor');

(async () => {
    let db = await massive(config.db_uri);
    monitor.attach(db.driverConfig);

    /**
     * saveDoc方法用于保存或更新文档表，
     * 每个文档表实际上会生成以下字段：id<自增>,body<JSONB类型>,search,create_at
     * 如果带id则是修改，如果不带id则是创建
     */
    let out = await db.saveDoc('reports', {
        title: 'you are niubibi',
        content: {
            key: '37',
            lists: [
                37,88
            ]
        }
    });
    console.log("out: \n"+JSON.stringify(out,null,4)); // 返回创建的文档记录
    
})().catch(e => {
    console.error(e);
})