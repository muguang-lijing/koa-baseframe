'use strict';
/**
 * 读取路由文档　生成　路由参数过滤器的配置文件
 */
const fs = require('fs');
const path = require('path');
const utils = require('../../libs/utils');

let out = {};

let router_dir = path.join(utils.baseDir(),'routes');
let fileList = fs.readdirSync(router_dir);
let params_types = ["String","Number","Boolean","Array","Object"];
let params_attrs = ["可不填",'默认值(default_value)',"最大值(n)","最小值(n)","数组值类型(type)","枚举值('xx','yy',...)","限长\n)"];

for (let f of fileList){
    let file_str = fs.readFileSync(path.join(router_dir,f),'utf-8');
    let doc_strs = file_str.match(/@api ([\s\S]*?)\*\//g);
    if (!doc_strs) { continue; }
    for (let doc of doc_strs){
        let pms = doc.match(/@.*\n/g);
        let p0,p1,p2,ps = [];
        for (let p of pms){
            if (p.slice(0,5)=="@api "){
                p0 = p;
            }
            if (p.slice(0,8)=="@apiName"){
                p1 = p;
            }
            if (p.slice(0,9)=="@apiGroup"){
                p2 = p;
            }
            if (p.slice(0,9)=="@apiParam"){
                ps.push(p);
            }
        }
        if (ps.length==0){ // 这个文档没有参数
            continue;
        }
        let router_title_infos = p0.replace(/\s+/g,',').split(',');
        let router_name = router_title_infos[2];
        let router_method = router_title_infos[1].replace(/[{}\s]/g,'');
        let apiName = p1.replace(/\s+/g,',').split(',')[1];
        let apiGroup = p2.replace(/\s+/g,',').split(',')[1];
        let apiParams = [];
        for (let i in ps){
            i = Number(i);
            let v = ps[i];
            let obj = {};
            let vr = v.replace(/\s+/g,'，').split('，');
            let p_type = vr[1].replace(/[{}\s]/g,''); // 获取到参数类型
            if (router_method=="get" && p_type!=="String"){
                throw new Error(`路由 ${router_name} 的文档第${i+1}个参数的类型配置不符合要求，get方法的参数只能是String类型`);
            }
            // 判断参数类型是否是合法类型
            if (params_types.indexOf(p_type)==-1){
                throw new Error(`路由 ${router_name} 的文档第${i+1}个参数的类型配置不符合要求，参数类型必须是:[${params_types}]`);
            }
            obj.type = p_type.toLowerCase();
            obj.name = vr[2];
            obj.required = true;
            if (!vr[3]){ // 参数的描述是必填的
                throw new Error(`路由 ${router_name} 的文档第${i+1}个参数的描述缺失`);
            }
            for (let n=4; n<30; n++){
                if (!vr[n]){ break; }
                let curv = vr[n];
                if (curv == "可不填"){
                    obj.required = false;
                }else if (/默认值\(.+\)/.test(curv)){
                    if (obj.required){
                        throw new Error(`路由 ${router_name} 的文档第 ${i+1} 个参数的<默认值>属性无效，因为该参数是必填的`);
                    }
                    let defv = curv.split('(')[1].slice(0,-1);
                    if (obj.type=="number"){
                        obj.default = Number(defv);
                        if (isNaN(obj.default)){
                            throw new Error(`路由 ${router_name} 的文档第 ${i+1} 个参数的<默认值>属性的默认值不合法，该参数默认值类型是Number`);
                        }
                    }
                    if (obj.type=="string"){
                        obj.default = defv;
                    }
                    if (obj.type=="boolean"){
                        if (["true","false"].indexOf(defv)==-1){
                            throw new Error(`路由 ${router_name} 的文档第 ${i+1} 个参数的<默认值>属性的默认值不合法，该参数默认值类型是Boolean`);
                        }
                        let temmp = { "true": true, "false": false };
                        obj.default = temmp[defv];
                    }
                    if (obj.type=="object"){
                        try{
                            obj.default = JSON.parse(defv);
                        }catch(e){
                            throw new Error(`路由 ${router_name} 的文档第 ${i+1} 个参数的<默认值>属性的默认值不合法，该参数默认值类型是Object，必须是可通过JSON.parse()转换的JSON字符串`);
                        }
                    }
                    if (obj.type=="array"){
                        try{
                            obj.default = JSON.parse(defv);
                            if (Array.isArray(obj.default)==false){
                                throw new Error(`路由 ${router_name} 的文档第 ${i+1} 个参数的<默认值>属性的默认值不合法，该参数默认值类型是Array`);
                            }
                        }catch(e){
                            throw new Error(`路由 ${router_name} 的文档第 ${i+1} 个参数的<默认值>属性的默认值不合法，该参数默认值类型是Array，必须是可通过JSON.parse()转换的JSON字符串`);
                        }  
                    }
                }else if (/最大值\(.+\)/.test(curv)){
                    if (obj.type=="number"){
                        let defv = curv.split('(')[1].slice(0,-1);
                        obj.max = Number(defv);
                        if (isNaN(obj.max)){
                            throw new Error(`路由 ${router_name} 的文档第 ${i+1} 个参数的<最大值>属性的值类型不合法，必须是Number类型`);
                        }
                    }else{
                        throw new Error(`路由 ${router_name} 的文档第 ${i+1} 个参数的<最大值>属性无效，该属性只适用于Number类型`);
                    }
                }else if (/最小值\(.+\)/.test(curv)){
                    if (obj.type=="number"){
                        let defv = curv.split('(')[1].slice(0,-1);
                        obj.min = Number(defv);
                        if (isNaN(obj.min)){
                            throw new Error(`路由 ${router_name} 的文档第 ${i+1} 个参数的<最小值>属性的值类型不合法，必须是Number类型`);
                        }
                    }else{
                        throw new Error(`路由 ${router_name} 的文档第 ${i+1} 个参数的<最小值>属性无效，该属性只适用于Number类型`);
                    }
                }else if (/数组值类型\(.+\)/.test(curv)){
                    if (obj.type=="array"){
                        let defv = curv.split('(')[1].slice(0,-1);
                        let js_types = ["string","number","boolean","object"];
                        if (js_types.indexOf(defv)==-1){
                            throw new Error(`路由 ${router_name} 的文档第 ${i+1} 个参数的<数组值类型>属性的值不合法，该属性的值只能是标准js类型：[${js_types}]`);
                        }
                        obj.vtype = defv;
                    }else{
                        throw new Error(`路由 ${router_name} 的文档第 ${i+1} 个参数的<数组值类型>属性无效，该属性只适用于Array类型`);
                    }
                }else if (/枚举值\(.+\)/.test(curv)){
                    if (["string","number"].indexOf(obj.type)==-1){
                        throw new Error(`路由 ${router_name} 的文档第 ${i+1} 个参数的<枚举值>属性无效，该属性只适用于String或Number类型`);
                    }
                    let defv = curv.split('(')[1].slice(0,-1);
                    if (defv.indexOf(',')==-1){
                        throw new Error(`路由 ${router_name} 的文档第 ${i+1} 个参数的<枚举值>属性的值不合法，该属性值中的不同枚举值之间要用英文逗号分割`);
                    }
                    let enumvs = defv.split(',');
                    if (obj.type=="number"){
                        for (let k in enumvs){
                            enumvs[k] = Number(enumvs[k]);
                            if (isNaN(enumvs[k])){
                                throw new Error(`路由 ${router_name} 的文档第 ${i+1} 个参数的<枚举值>属性的值不合法，不是有效的数字类型`);
                            }
                        }
                    }
                    if (obj.type=="string"){
                        for (let k in enumvs){
                            if (~enumvs[k].indexOf(`"`) || ~enumvs[k].indexOf(`'`)){
                                throw new Error(`路由 ${router_name} 的文档第 ${i+1} 个参数的<枚举值>属性的值不合法，此处的字符串类型不需要加双引号或单引号，用法如：枚举值(ok,raw,cancel)`);
                            }
                        } 
                    }
                    obj.enum = enumvs;
                }else if (/限长\(.+\)/.test(curv)){
                    if (["string","number","array"].indexOf(obj.type)==-1){
                        throw new Error(`路由 ${router_name} 的文档第 ${i+1} 个参数的<限长>属性无效，该属性只适用于String或Number类型`);
                    }
                    let defv = curv.split('(')[1].slice(0,-1);
                    defv = parseInt(defv);
                    if (isNaN(defv)){
                        throw new Error(`路由 ${router_name} 的文档第 ${i+1} 个参数的<限长>属性的值不合法，不是有效的数字类型`);
                    }
                    obj.limit = defv;
                }else{
                    throw new Error(`路由 ${router_name} 的文档第 ${i+1} 个参数的第 ${n-3} 个属性格式不正确，不存在这种属性，目前有７种属性：[${params_attrs}]`);
                }
            }
            apiParams.push(obj);
        }
        out[router_name] = {apiName,apiGroup,apiParams};
    }
}

let aim_dir = path.join(utils.baseDir(),'config','routers_filter.js');
let write_str = `
'use strict';
/**
 * 路由参数过滤器的配置文件
 */
module.exports = `+JSON.stringify(out,null,4);
fs.writeFileSync(aim_dir,write_str);

console.log("路由参数自动过滤 代码生成成功");