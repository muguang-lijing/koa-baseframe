'use strict';

const config = require('../config');
const massive = require('mg-massive');
const monitor = require('pg-monitor');

(async ()=>{
    let db = await massive(config.db_uri);
    monitor.attach(db.driverConfig); 
    let outs = [],cur;

    cur = await db.massive.find();  // 或者 await db.massive.find({});
    outs.push(cur);

    cur = await db.massive.find({
        is_show: true,
        'weight >': 30
    });
    outs.push(cur);

    cur = await db.massive.find({
        'price between': [50,99] // 注意，该范围是闭区间
    });
    outs.push(cur);

    cur = await db.massive.find({
        'extra is not': null 
    });
    // 或者：
    // cur = await db.massive.find({
    //     'extra <>': null 
    // });
    outs.push(cur);

    cur = await db.massive.find({
        'extra.comment[0] ilike': 'xxx%'
    });
    outs.push(cur);

    cur = await db.massive.find({
        'extra.comment[0].name ilike': 'HH_'
    });
    outs.push(cur);

    cur = await db.massive.find({
        'attrs.产地': '广西'
    });
    outs.push(cur);

    cur = await db.massive.findOne({
        'attrs.产地': '广西'
    },{
        columns: ['name']
    });
    outs.push(cur);

    cur = await db.massive.find({
        'extra.money.default >': 10
    },{
        columns: ['name xnm','attrs.产地','extra.money.default m_def']
    });
    outs.push(cur);

    for (let i in outs){
        console.log("\nouts["+i+"]: \n"+JSON.stringify(outs[i],null,4));   
    }
    
})().catch(e=>{
    console.error(e);
})
