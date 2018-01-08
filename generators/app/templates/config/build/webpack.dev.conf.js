let webpack = require('webpack');
let path = require('path');
let merge = require('webpack-merge');
let base = require('./webpack.base.conf.js');
let app = require('../env');
let dist = app.dist;
let rootdir = app.rootdir;

module.exports = merge(base, {
    watch: true,
    devtool: 'eval', // 方便源码调试
    output: {
        path: path.join(rootdir, dist),
        publicPath: '',
        filename: '[name].bundle.js',
        chunkFilename: '[name].chunk.js'
    }
});
