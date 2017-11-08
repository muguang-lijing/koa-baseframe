'use strict';
const rp = require('request-promise');
const utils = require('mg-utils');

(async ()=>{
    let out = {};
    await rp('http://127.0.0.1:5000/test/setredistst?name=zhouzhiming');
    for (let i = 0; i < 200; i++) {
        let res = await rp({
            method: 'GET',
            uri: 'http://127.0.0.1:5000/test/redisTest',
            json: true
        });  
        if (!res.err){
            console.log("req pid: "+res.out.pid+" name:"+res.out.reout);
            // if (out['pid-'+res.out]){
            //     out['pid-'+res.out] = out['pid-'+res.out] + 1;
            // }else{
            //     out['pid-'+res.out] = 1;
            // }
        }
        // await utils.delay(100);
    }           
})().catch(err=>{
    console.error(err);
})