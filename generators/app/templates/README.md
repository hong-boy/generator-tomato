## 轻应用配置平台

* 环境依赖
* 开始
* 目录结构说明
* 目标

### 环境依赖
* __Nodejs 7.10+__
* __pm2__: 用于管理node进程 ```npm install -g pm2```
* [__pm2-logrotate__](https://www.npmjs.com/package/pm2-logrotate): pm2提供的日志运维工具  ```pm2 install pm2-logrotate```
* __配置环境变量NODE_ENV_BAAS__：
    * __uat__: Demo环境
    * __production__: 生产环境
    * __development__: 开发环境 
    * __test__: 仅用于跑单元测试  
___(为什么不用NODE_ENV?? 它太通用了，而且一台服务器上可能部署多个不同的NodeJS项目，每个项目对NODE_ENV的定义可能不同！)___

### 开始

* __安装依赖__：```npm install```
* __启动__：```npm run start```
* __webpack实时编译__：```npm run watch [:dll]``` //其中:dll表示强制重新编译DLL文件
* __生产环境打包__：```npm run pkg:prd```
* __Demo环境打包__：```npm run pkg:uat```
* __单元测试__：```npm test```
* __代码覆盖率__：```npm run test:cover```

### 目录结构说明
>
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
>
* 调试  
>
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

### package版本管理
>
```
1. 先全局安装npm-check-updates模块
	npm install -g npm-check-updates
2. 检查当前项目中可更新的模块
	a) 进入package.json所在目录
	b) 执行ncu命令
3. 升级模块
	a) 升级指定模块：ncu [MODULE_NAME]
	b) 升级所有模块：
```
**PS: 具体用法见[官网](https://www.npmjs.com/package/npm-check-updates)**

### npm语义化版本
> npm版本采用的是[语义化管理方式](https://semver.org/lang/zh-CN/)，十分灵活，但也会带来一个烦恼：  
> 比如有个moduleA依赖moduleB@~1.0.x，当执行```npm install```的时候很可能出现在本地开发环境里面安装的是1.0.2版本，而在生产环境打包时安装的是1.0.0的版本。  
> 为了解决这个问题，可以使用```npm shrinkwrap```来生成npm-shrinkwrap.json文件，可以精确指定当前所安装的模块版本，并且我们需要将npm-shrinkwrap.json文件添加到git的版本控制中去。以后我们安装新模块之后，都需要手动执行```npm shrinkwrap```来更新npm-shrinkwrap.json文件。

### npm依赖包去重
> 在进行nodejs开发的时候会用到很多不同功能的第三方模块，这些第三方模块可能会依赖相同的模块，npm 3.0之前这些模块都会被安装到各自的目录树里面，node_modules目录下的结构大致为：
```
moduleA
--moduleB@1.0.2
moduleC
--moduleB@1.0.2
moduleD
--moduleB@2.0.0
```
此时我们可以执行```npm dedupe```来去掉重复的包，执行dedupe命令之后目录如下：
```
moduleB@1.0.2
moduleA
--
moduleC
--
moduleD
--moduleB@2.0.0
```
当然如果我们使用的npm3.0+版本，这个过程会自动执行一次。  

>   
如果我们通过```npm-check-updates```模块更新了moduleB为2.0.0后，此时目录如下：
```
moduleB@2.0.2
moduleA
--
moduleC
--
moduleD
--moduleB@2.0.0
```
然后手动执行```npm dedupe```命令去重，目录更新为：
```
moduleB@2.0.0
moduleA
--
moduleC
--
moduleD
--
```
最后在执行```npm shrinkwrap```命令来更新npm-shrinkwrap.json文件，将版本号精确锁定。
