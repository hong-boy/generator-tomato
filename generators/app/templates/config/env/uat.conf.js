let deepMerge = require('lodash/defaultsDeep');
let base = require('./base.conf');
/**
 * 用于demo环境
 */
module.exports = deepMerge({
    debug: false,
    port: 3017,
    env: 'uat',
    dist: 'dist/uat',
    log4js: {
        level: 'info'
    },
    session: {
        key: 'uatsid',
        store: require('../session/redis.store.js') // 传入SessionStore类
    },
    webservice: {
        baseUrl: '',
        gzip: true,
    },
    redis: {
        host: '',
        port: 6379,
        db: 15,
        keyPrefix: 'BAASBS:UAT:',
        maxAge: 3600000,
    },
    store: 'redis'
}, base);
