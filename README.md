# koa-baseframe
koa  通用项目基础框架

### 基础环境  
- node > 4.x.x
- redis

### 运行  
- 进入项目目录 运行 `npm install`
- `npm start`
- 访问 http://127.0.0.1:5042

### 结构介绍  
- 路由。采用分级路由结构，路由文件位于routes目录下，路由文件名为该路由文件下所有路由的基路由，例如，test.js路由文件下'/hello'的访问路由是：'/test/hello'

