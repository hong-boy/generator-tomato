'use strict';
let deepMerge = require('lodash/defaultsDeep');
let base = require('./base.conf');
/**
 * 用于开发环境
 */
module.exports = deepMerge({
    debug: true, // true-开发环境 false-生产环境
    port: 3007,
    env: 'development',
    dist: 'dist/dev',
    log4js: {
        level: 'debug'
    },
    webservice: {
        baseUrl: 'http://172.19.3.138:6542/web',
        gzip: true,
    },
    store: null
}, base);
