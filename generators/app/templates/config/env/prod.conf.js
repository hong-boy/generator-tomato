let deepMerge = require('lodash/defaultsDeep');
let base = require('./base.conf');
/**
 * 用于生产环境
 */
module.exports = deepMerge({
    debug: false,
    port: 3017,
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
        baseUrl: '',
        gzip: true,
    },
    redis: {
        host: '',
        port: 6379,
        db: 15,
        keyPrefix: 'BAAS:PRD:',
        maxAge: 3600000,
    },
    store: 'redis'
}, base);
