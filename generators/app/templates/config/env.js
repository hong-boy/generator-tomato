'use strict';
let isProd = false; // 是否为生产环境
let isTest = false; // 是否为测试环境
let configure = {};
let env = process && process.env && process.env.NODE_ENV;
if (env) {
    let env = process.env.NODE_ENV;
    isProd = (env === 'production');
    isTest = (env === 'test');
    console.info('Current NODE_ENV is %s...', env);
} else {
    console.info('No NODE_ENV specified! It will use [dev.conf.js] as default...');
}

configure = isProd ? require('./env/prod.conf') : (isTest ? require('./env/test.conf') : require('./env/dev.conf'));

module.exports = configure;
