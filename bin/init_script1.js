'use strict';
/**
 * 同步个别表
 */
const models = require('../models');

(async ()=>{
    let init_tables = [ // 要同步的表名
        '小伙子别乱来'
    ];
    for (let table of init_tables) {
        await models[table].sync({
            force: true,
            logging: console.log,
        });
    }
    console.log('[models/init_script.js] sequelize sync success');
    process.exit(0);
})().catch(function(err) {
    console.error('[models/init_script.js] sequelize sync fail');
    console.error(err);
    process.exit(1);
});