'use strict';
/**
 * 系统自动处理使用到的逻辑代码，可不用管理
 */
const log = require('../libs/logger').tag('auto');

async function udaterfield(models,tableName,link_fields,new_obj,change_obj,trx){
    let ts_id = new_obj.id;
    let idfname = 'id_f_'+tableName;
    let set_tbs = {};
    for (let field in link_fields){
        let tables = link_fields[field];
        if (change_obj[field]){
            for (let t of tables){
                if (set_tbs[t]){
                    set_tbs[t].push(field);
                }else{
                    set_tbs[t] = [field];
                }
            }
        }
    }
    console.log("set_tbs:\n"+JSON.stringify(set_tbs,null,4));
    for (let tb in set_tbs){
        let updateObj = {};
        let fields = set_tbs[tb];
        for (let fd of fields){
            updateObj[fd+'_f_'+tableName] = new_obj[fd];
        }
        console.log(tb+" ready to update: "+JSON.stringify(updateObj));
        await models[tb].update(updateObj,{
            where: { [idfname]: ts_id },
            transaction: trx
        });
    }    
}

module.exports = {
    udaterfield
};