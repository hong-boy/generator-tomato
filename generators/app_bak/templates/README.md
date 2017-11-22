## koa2 + Vue2.0

* 环境依赖
* 开始
* 目录结构说明
* 目标

### 环境依赖
* Nodejs 7或者babel编译

### 开始
* 安装依赖：```npm install```
* 启动：```npm run start```
* webpack实时编译：```npm run watch```
* 生产环境打包：```npm run pkg```
* 单元测试：```npm test```
* 代码覆盖率：```npm run test:cover```

### 目录结构说明
```
---
├─bin  
├─config  
│  ├─build  
│  ├─env  
│  ├─passport  
│  ├─privs  
│  └─session  
├─coverage  
├─dist  
├─logs  
├─src  
│  ├─app  
│  │  ├─bean  
│  │  ├─controller  
│  │  ├─route  
│  │  └─util  
│  └─views  
│      ├─assets  
│      │  ├─image  
│      │  └─less  
│      ├─components  
│      │  ├─common  
│      ├─routes  
│      └─utils  
└─test  
---
```

### 单元测试
* 调试  

``` 
1. 先全局安装node-inspector模块
    npm install -g node-inspector
2. 启动node-inspector
    node-inspector --web-port 8089
3. 已调试模式执行测试用例
    mocha -t [TIMEOUT_MILLSECONDS] --debug-brk [TEST_CASE_FILE]
4. 打开浏览器输入地址即可开始调试代码：[http://localhost:8089/debug?port=5858]
```
**PS：也可以直接使用```npm run test:debug [TEST_CASE_FILE]```命令（见package.json）**

### 目标
1. Vue2作为视图层，Koa2作为控制层
2. 支持mongo，支持REST
3. webpack2完成打包、即时编译
4. 支持https
5. 必须编写测试用例，方便代码重构、代码覆盖测试
6. js语法检查
7. 多页面和单页面混用支持
8. 支持第三方登录，微博、微信
9. 支持CSP，XSS过滤
