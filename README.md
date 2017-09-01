# koa-baseframe
koa v2.x 工程级项目架构

### 基础环境  
- node > 7.6.x
- 数据库的链接字符串可在配置文件（config/dev.js）中设置，支持 mysql / postgres
- redis 的配置在　配置文件中设置，其中 redis 是业务逻辑使用的redis, redisSession 是　session 使用的redis

### 运行  
- 进入项目目录 运行 `npm install`  
- 修改配置文件，确保 数据库链接字符串正确  
- 同步数据库（新环境第一次运行项目） 运行 `npm run initDb`  
- 运行，推荐使用pm2，首先全局安装pm２, 然后运行 `pm2 start pm2_config.json`。或直接启动，运行`npm start`
- 访问 http://127.0.0.1:5000/test

### 目录介绍  
- bin                   项目启动文件以及数据库初始化文件  
- config                配置文件,其中 dev 为　本地开发配置文件， product 为生产环境配置文件
- libs                  代码库以及工具包等项目常用代码逻辑  
- middlewares           常用koa中间件的模块化封装  
- models                数据库模型定义相关文件以及与数据库底层相关的操作逻辑,改文件夹下除了index.js文件外其余的都是数据表模型文件，一个文件对应一个表  
- public                静态目录文件夹，一般放置静态页面或资源，改路径下的资源可直接访问而不经路由控制  
- routes                路由控制文件夹，用于放置网站的路由接口代码，采用分级路由结构  
- test                  测试代码文件夹，放置项目的测试代码，用于自动化测试  
- views                 后端输出页面文件夹，该目录下的页面由后端代码生成并经路由控制输出  
- app.js                项目的全局设置及中间件

### 数据库操作
- 项目成功运行后，可依次从上往下执行 routes/orders 中的路由进行测试。关于数据库操作具体可参考：[http://itbilu.com/nodejs/npm/N1yrA4HQW.html](http://itbilu.com/nodejs/npm/N1yrA4HQW.html)

### 日志记录与查看  
- 首先需安装一个命令行工具用于方便查看日志： `npm install -g bunyan`  
- 启动项目并将日志输出到日志文件 `npm run logStart`  
- 进到项目根目录，执行命令以查看日志 `tail -200f log.txt | bunyan -L` ，次命令需要linux命令行，window下的linux shell模拟器也可以  
- 过滤特定等级日志 `tail -200f log.txt | bunyan -l 40` ， 只看level高于40的日志记录  
- 具体参考：[https://npm.taobao.org/package/bunyan#log-method-api](https://npm.taobao.org/package/bunyan#log-method-api)

### 接口文档  
- 接口文档采用 [apidoc](http://apidocjs.com/) 模块根据源码注释自动生成  
- 安装apidoc命令行工具：`npm install apidoc -g`  
- 路由接口注释的写法可查阅文档并参考　`testapi/restapi.js`  
- 同步接口注释到文档：　`npm run syncDoc`　，然后访问　http://127.0.0.1:5042/apidoc 即可查看生成的线上接口文档  
- 注意：正式使用时需要在package.json里面把文档生成命令的输入选项该为项目的实际路由目录

### 重要引导
- `bin/crontab`目录下主要存放一些定时任务的js，需要定时运行的脚本可在　`bin/crontab/index.js`文件里配置  
- `bin/single.js` 文件为单实例文件，需要　限制只运行一次的代码可放在该脚本的main函数里。（注：这种情况出现在用pm2运行项目的时候，可能会根据cpu核数启动多个实例，因此对于想只运行一次的代码可放在 single.js文件的main函数里）  
- `libs/common.js` 文件主要存放一些业务通用或可复用的逻辑函数  
- `libs/utils`  文件是项目一般常用的工具类函数  
- `public/res` 目录是个特殊目录，该目录下的变动不会导致pm2重启项目  
- `views` 目录下是后端模板文件，模板采用art-template,模板文件后缀为'.htm'(其实该模板后缀应该是'.art'，但是编辑器目前一般无法对该后缀的文件进行智能感知渲染)

### 增加的功能  
- 用户角色及权限管理。
角色对应权限，即一个角色对应一组路由，需要专门建一个路由文件来配置不同角色的路由，可设置白名单，黑名单，或者正则表达式匹配，或者继承其他角色的权限
访问权限的控制统一由一个中间件实现
角色信息本身不需要建表保存，由角色配置文件来记录
角色配置文件为 `config/role_dev` , `config/role_product`，分别为生产环境和开发环境的角色配置
用户表固定为usr，其中必备的基础字段为： id (uuid), name (string), password (string), role (string),head_img(string), email (string)
用户的session状态保存统一规范，session.role, session.uid, session.uinfo
或者采用另一种模式： 每个角色一个表，但每个表都必须有id和role字段，表名就是角色名称，而且session用户状态的保存格式一定要统一，按照上面的规范
- 默认路由处理中间件，当访问不存在的路由时渲染404页面;当浏览器请求默认图标（/favicon.ico）时返回空字符串;访问根目录暂时返回固定欢迎字符串
- 错误处理调整，当在路由中抛错误的时候，可指定错误信息和错误码，如: `ctx.throw(["类型错误",5],200);`，第一个参数是一个数组，第一项为错误信息，第二项为错误码（可以直接是字符串，那错误码默认为-1，如：`ctx.throw("该用户id不存在",200);`）
- 增加路由接口参数自动过滤中间件（程序启动执行脚本读取文档，自动生成参数检查中间件），过滤规则大概有：类型校验，是否必填，默认值，最大值最小值，枚举值，字符串长度限制  
- 数据库可以不删数据进行同步  
- 对于某些表中的副本字段（即除了id之外其他表中的复制字段，方便查询），框架可以做到联动修改，用户只需要在表中按照要求的格式（field_f_tablename）建立字段，系统提动前的与执行脚本就会自动生成响应的钩子代码，从而实现自动联动修改

### 需要增加的功能

- 原生sql语句连表查询需要包装，以便可以方便地已对象操作的方式进行　doing
- 通用常规单表查询（筛选条件，分页，排序，字段筛选）进一步简化写法，通过中间件执行固定模式，用户路由里只写必要配置 doing
- 给每个模型文件和路由文件自动补充日志引用代码　doing
- 常用代码片段的补充(常用数据库模型操作，数据库类型补全,甚至是自动生成代码片段) doing
- 与执行代码进行一些常规检测（有哪些模块引用是没有用到的，）　doing
- 数据库模型的建立需要实现一个界面化的操作配置工具，工具自动生成实际代码　doing
- 将图像处理集成到框架内，对于操作系统需要装的东西在项目依赖中描述清楚 doing

### 需要解决的问题  

- 为什么有些错误try catch 无法捕获？　doing

### 框架的统一约定性规则  
- session中用户信息字段格式统一：ctx.session = {uid,name,head,phone,role}
- 路由分页写法统一，由代码片段生成
- 路由的请求数据获取写法统一：　GET: `let query = ctx.query;`; POST: `let rbody = ctx.request.body;`
- 路由中当前用户id获取方式统一：　`let cur_uid = ctx.session.uid;`
- 自定义工具包模块引入后命名为 utils ,以便和node自带模块 util 区分开。
- 文档参数类型有["String","Number","Boolean","Array","Object"]
- get请求的参数类型只能是String类型
- 数据库与时间有关的字段全部统一用整型，模型的配置 timestamps 统一设置为 false
- 数据库中不允许NULL值的存在，用默认值代替


