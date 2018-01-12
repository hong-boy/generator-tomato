'use strict';
let deepMerge = require('lodash/defaultsDeep');
let base = require('./base.conf');
/**
 * 用于开发环境
 */
module.exports = deepMerge({
    debug: true, // true-开发环境 false-生产环境
    port: 3001,
    env: 'development',
    dist: 'dist/dev',
    log4js: {
        level: 'debug'
    },
    webservice: {
        baseUrl: 'http://172.19.3.138:6542/web',
        gzip: true,
    },
    baas_rest_api_sdk: { // BaaS REST API
        debug: true,
        rejectUnauthorized: false,
        domain: 'http://172.19.3.138:6549'
    },
    store: null
}, base);
