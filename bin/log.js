// "use strict"

// const MongoClient = require('mongodb').MongoClient;
// const assert = require('assert');
// const config = require('../config');
// const util = require('../libs/utils');
// const rp = require('request-promise');

// process.stdin.setEncoding('utf8');

// process.stdin.on('end', () => {
//     process.stdout.write('log stdin end');
// });

// let log_table_name = 'datas';

// let isPro = util.isProduction();

// process.stdin.on('data',async thunk => {
//      if (isPro){ 
//         let db = await MongoClient.connect(config.db_log_uri);
//         let outsr = '['+thunk.replace(/\n/g,',').slice(0,-1)+']';
//         let objs = JSON.parse(outsr);
//         for (let o of objs){
//             logFileter(o);
//         }
//         await db.collection(log_table_name).insertMany(objs);
//         db.close();
//     }else{
//         console.log(thunk);
//     }
// });

// function logFileter(log){
//     if (log.level >= 50){
//         let log_str = `错误日志：\n
//         msg: ${log.msg}\n
//         data: ${log.data}\n
//         tag: ${log.tag}\n
//         time: ${log.time}
//         `;
//         rp({
//             method: 'POST',
//             uri: 'http://127.0.0.1:12345/putout_errorlog',
//             headers: {
//                 'flag': parseInt(Date.now()/3600000).toString(2)
//             },
//             body: {
//                 error_log: log_str
//             },
//             json: true 
//         }).then(res=>{
//         }).catch(err=>{
//             console.log("+++++++++++ error: "+JSON.stringify(err));
//         });
//     }
// }