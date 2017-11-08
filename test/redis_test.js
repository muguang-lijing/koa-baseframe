'use strict';
const rp = require('request-promise');
const utils = require('mg-utils');

(async ()=>{
    let out = {};
    console.time('clu');
    for (let i = 0; i < 500; i++) {
        let res = await rp({
            method: 'GET',
            uri: 'http://127.0.0.1:5000/test/redisTest',
            json: true
        });  
        // console.log("req out: "+i);
        if (!res.err){
            if (out['pid-'+res.out.pid]){
                out['pid-'+res.out.pid] = out['pid-'+res.out.pid] + 1;
            }else{
                out['pid-'+res.out.pid] = 1;
            }
        }
        // await utils.delay(100);
    }           
    console.log("result: "+ JSON.stringify(out,null,4));
    console.timeEnd('clu');
})().catch(err=>{
    console.error(err);
})