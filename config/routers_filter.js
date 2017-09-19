
'use strict';
/**
 * 路由参数过滤器的配置文件
 */
module.exports = {
    "/log/findAll": {
        "apiName": "log_find",
        "apiGroup": "Log",
        "apiParams": [
            {
                "type": "number",
                "name": "page",
                "required": false
            },
            {
                "type": "number",
                "name": "len",
                "required": false
            },
            {
                "type": "string",
                "name": "tag",
                "required": false
            },
            {
                "type": "number",
                "name": "level",
                "required": false
            },
            {
                "type": "string",
                "name": "msg",
                "required": false
            },
            {
                "type": "number",
                "name": "start_tm",
                "required": true
            },
            {
                "type": "number",
                "name": "end_tm",
                "required": true
            }
        ]
    },
    "/log/findReq": {
        "apiName": "log_findReq",
        "apiGroup": "Log",
        "apiParams": [
            {
                "type": "number",
                "name": "page",
                "required": false
            },
            {
                "type": "number",
                "name": "len",
                "required": false
            },
            {
                "type": "string",
                "name": "reqId",
                "required": false
            },
            {
                "type": "string",
                "name": "uid",
                "required": false
            },
            {
                "type": "string",
                "name": "url",
                "required": false
            },
            {
                "type": "string",
                "name": "type",
                "required": false,
                "enum": [
                    "GET",
                    "POST"
                ]
            },
            {
                "type": "string",
                "name": "cookie",
                "required": false
            },
            {
                "type": "string",
                "name": "user_agent",
                "required": false
            },
            {
                "type": "string",
                "name": "content_type",
                "required": false
            },
            {
                "type": "string",
                "name": "res_content_type",
                "required": false
            },
            {
                "type": "number",
                "name": "res_status_code",
                "required": false
            },
            {
                "type": "string",
                "name": "res_body",
                "required": false
            },
            {
                "type": "number",
                "name": "start_tm",
                "required": true
            },
            {
                "type": "number",
                "name": "end_tm",
                "required": true
            }
        ]
    },
    "/other/upload_base64": {
        "apiName": "uploadBase64",
        "apiGroup": "Other",
        "apiParams": [
            {
                "type": "string",
                "name": "str",
                "required": true
            }
        ]
    },
    "/test/redis": {
        "apiName": "redis",
        "apiGroup": "Test",
        "apiParams": [
            {
                "type": "string",
                "name": "id",
                "required": true
            },
            {
                "type": "number",
                "name": "num",
                "required": false,
                "default": -1,
                "max": 100,
                "min": -100
            },
            {
                "type": "array",
                "name": "codes",
                "required": true,
                "vtype": "number",
                "shortest": 1
            },
            {
                "type": "number",
                "name": "status",
                "required": true,
                "enum": [
                    34,
                    3,
                    9
                ]
            },
            {
                "type": "string",
                "name": "content",
                "required": true,
                "limit": 5
            },
            {
                "type": "boolean",
                "name": "is_free",
                "required": true
            },
            {
                "type": "object",
                "name": "remark",
                "required": false,
                "default": {
                    "name": "lijing",
                    "age": 34
                },
                "okeys": [
                    "name<string>",
                    "age<number>"
                ]
            }
        ]
    },
    "test/roletest1": {
        "apiName": "roletest1",
        "apiGroup": "Test",
        "apiParams": [
            {
                "type": "string",
                "name": "name",
                "required": true,
                "limit": 20
            },
            {
                "type": "number",
                "name": "age",
                "required": true,
                "max": 200,
                "min": 0
            },
            {
                "type": "array",
                "name": "interests",
                "required": true,
                "limit": 3
            },
            {
                "type": "object",
                "name": "des",
                "required": true
            }
        ]
    }
}