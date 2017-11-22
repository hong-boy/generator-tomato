let deepMerge = require('lodash/defaultsDeep');
let base = require('./base.conf');
/**
 * 用于生产环境
 */
module.exports = deepMerge({
    debug: false,
    port: 3002,
    env: 'production',
    dist: 'dist/prod',
    log4js: {
        level: 'info'
    },
    session: {
        key: 'prdsid',
        store: require('../session/redis.store.js') // 传入SessionStore类
    },
    webservice: {
        baseUrl: 'http://172.19.3.138:6542/web',
        gzip: true,
    },
    store: 'redis'
}, base);
