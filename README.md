# generator-tomato scaffolding
[![Build Status](https://travis-ci.org/hong-boy/generator-tomato.svg?branch=master)](https://travis-ci.org/hong-boy/generator-tomato)
* 安装
* 如何使用

## 安装
```js
npm install -g generator-tomato yeoman
```
## 如何使用
```js
// 创建新文件夹
mkdir myproject
// 进入目录
cd myproject
// 执行generator-tomato命令
yo tomato
```
PS: 根据提示输入```appname(工程名称)```、```apppath(URL逻辑根路径)```即可完成应用创建。  应用创建完成后，需要安装应用所依赖的包:
```js
npm install
```
## 启动生成的项目
```js
npm run watch
npm start
```
PS: 需要nodejs7.0+环境或者使用babel进行编译
