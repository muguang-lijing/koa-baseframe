define({ "api": [
  {
    "type": "post",
    "url": "/log/findAll",
    "title": "k分页获取日志信息，默认按时间降序排序",
    "description": "<p>作者：李静</p>",
    "version": "0.0.1",
    "name": "log_find",
    "group": "Log",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "page",
            "description": "<p>页码，从0开始 可不填</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "len",
            "description": "<p>每页的长度，默认10 可不填</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "tag",
            "description": "<p>标签（精准匹配） 可不填</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "level",
            "description": "<p>日志级别（精准匹配） 可不填</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>概要信息（模糊匹配） 可不填</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "start_tm",
            "description": "<p>开始时间，秒级时间戳</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "end_tm",
            "description": "<p>结束时间，秒级时间戳</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "err",
            "description": "<p>错误信息，成功则为空</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "out",
            "description": "<p>成功则为 数据列表</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "成功时返回的结果：",
          "content": "{\n  err: \"\",\n  out: {\n    datas: [...]\n  }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/log.js",
    "groupTitle": "Log"
  },
  {
    "type": "post",
    "url": "/log/findReq",
    "title": "k分页获取请求日志信息，默认按时间降序排序",
    "description": "<p>作者：李静</p>",
    "version": "0.0.1",
    "name": "log_findReq",
    "group": "Log",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "page",
            "description": "<p>页码，从0开始 可不填</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "len",
            "description": "<p>每页的长度，默认10 可不填</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "reqId",
            "description": "<p>请求id（精准匹配） 可不填</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "uid",
            "description": "<p>请求用户id（精准匹配） 可不填</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "url",
            "description": "<p>请求路由（模糊匹配） 可不填</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "type",
            "description": "<p>请求类型 可不填 枚举值(GET,POST)</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "cookie",
            "description": "<p>请求cookie（模糊匹配） 可不填</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "user_agent",
            "description": "<p>请求user_agent（模糊匹配） 可不填</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "content_type",
            "description": "<p>请求content_type（模糊匹配） 可不填</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "res_content_type",
            "description": "<p>请求res_content_type（模糊匹配） 可不填</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "res_status_code",
            "description": "<p>请求响应状态码（精准匹配） 可不填</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "res_body",
            "description": "<p>请求响应体（模糊匹配） 可不填</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "start_tm",
            "description": "<p>开始时间，秒级时间戳</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "end_tm",
            "description": "<p>结束时间，秒级时间戳</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "err",
            "description": "<p>错误信息，成功则为空</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "out",
            "description": "<p>成功则为 数据列表</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "成功时返回的结果：",
          "content": "{\n  err: \"\",\n  out: {\n    datas: [...]\n  }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/log.js",
    "groupTitle": "Log"
  },
  {
    "type": "get",
    "url": "/other/is_login",
    "title": "判断是否登录",
    "description": "<p>作者：李静</p>",
    "version": "0.0.1",
    "name": "is_login",
    "group": "Other",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "err",
            "description": "<p>错误信息</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "out",
            "description": "<p>成功信息</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "成功时返回的结果：",
          "content": "{\n\terr: { code: 0 },\n\tout: {\n\t\tresult: false, // 若没有登录是false，若登录则是角色名称\n\t}\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/other.js",
    "groupTitle": "Other"
  },
  {
    "type": "post",
    "url": "/other/upload_base64",
    "title": "上传base64格式的数据",
    "description": "<p>作者：李静</p>",
    "version": "0.0.1",
    "name": "uploadBase64",
    "group": "Other",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "str",
            "description": "<p>base64数据</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "err",
            "description": "<p>错误信息，成功则为空</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "out",
            "description": "<p>上传成功的文件访问地址</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "成功时返回的结果：",
          "content": "{\n  err: \"\",\n  out: { url: \"http://skill.szshanlian.com/res/imgs/234eriu.jpg\" }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/other.js",
    "groupTitle": "Other"
  },
  {
    "type": "post",
    "url": "/test/redis",
    "title": "redis测试",
    "description": "<p>作者：李静</p>",
    "version": "0.0.2",
    "name": "redis",
    "group": "Test",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>测试id</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "num",
            "description": "<p>设置的值　可不填　默认值(-1) 最大值(100) 最小值(-100)</p>"
          },
          {
            "group": "Parameter",
            "type": "Array",
            "optional": false,
            "field": "codes",
            "description": "<p>代码值数组 数组值类型(number) 最短(1)</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "status",
            "description": "<p>状态值 枚举值(34,3,9)</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "content",
            "description": "<p>内容字符串　限长(5)</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": false,
            "field": "is_free",
            "description": "<p>是否免费</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "remark",
            "description": "<p>备注信息　可不填　默认值({&quot;name&quot;:&quot;lijing&quot;,&quot;age&quot;:34}) 必有字段(name<string>,age<number>)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "err",
            "description": "<p>错误信息</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "out",
            "description": "<p>成功信息</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "成功时返回的结果：",
          "content": "{\n\terr: { code: 0 },\n\tout: {\n\t\t\n\t}\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/test.js",
    "groupTitle": "Test"
  },
  {
    "type": "post",
    "url": "test/roletest1",
    "title": "测试路由２",
    "description": "<p>作者：李静</p>",
    "version": "0.0.2",
    "name": "roletest1",
    "group": "Test",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>名称　限长(20)</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "age",
            "description": "<p>年龄　最大值(200)　最小值(0)</p>"
          },
          {
            "group": "Parameter",
            "type": "Array",
            "optional": false,
            "field": "interests",
            "description": "<p>兴趣　限长(3)</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "des",
            "description": "<p>简介</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "err",
            "description": "<p>错误信息</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "out",
            "description": "<p>成功信息</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "成功时返回的结果：",
          "content": "{\n\terr: { code: 0 },\n\tout: {\n\t\t\n\t}\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/test.js",
    "groupTitle": "Test"
  }
] });