'use strict';
let deepMerge = require('lodash/defaultsDeep');
let base = require('./base.conf');
/**
 * 用于单元测试
 */
module.exports = deepMerge(base, {
    debug: false, // true-开发环境/测试环境 false-生产环境
    agent: 'http://localhost:3007/baasbs',
    env: 'test',
    dist: 'dist/dev',
    user: {
        name: '',
        pwd: ''
    }
});
