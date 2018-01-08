'use strict';
let path = require('path');
let webpack = require('webpack');
let HtmlWebpackPlugin = require('html-webpack-plugin');
let ExtractTextPlugin = require('extract-text-webpack-plugin');
let app = require('../env');

const dist = app.dist;
const rootdir = app.rootdir;

const conf = {
    entry: {
        main: ['babel-polyfill', path.join(rootdir, 'views', 'main.js')],
    },
    output: {
        path: path.join(rootdir, dist),
        publicPath: '', // 相对路径 - 相对于index.html页面的base标签
        filename: '[name].[chunkhash].bundle.js',
        chunkFilename: '[name].[chunkhash].chunk.js'
    },
    resolve: {
        extensions: [' ', '.js', '.vue'],
        alias: {
            vue: 'vue/dist/vue.common.js',
            IOT: path.resolve(rootdir, 'views/utils/common.js'),
        }
    },
    module: {
        rules: [
            {test: /\.vue$/, use: ['vue-loader']},
            {test: /\.js$/, use: ['babel-loader'], exclude: /node_modules/},
            {
                test: /\.(css|less)$/,
                // use: ['style-loader', 'css-loader', 'less-loader']
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'less-loader']
                })
            },
            {
                test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)(\?\S*)?$/,
                use: {loader: 'file-loader', options: {name: '[name]-[hash].[ext]'}}
            }
        ]
    },
    plugins: [
        // new webpack.ProvidePlugin({
        //     Vue: "vue",
        //     jquery: "jquery",
        //     jQuery: "jquery",
        //     $: "jquery",
        //     IOT: 'IOT',
        // }),
        new HtmlWebpackPlugin({
            inject: true,
            favicon: path.resolve(rootdir, 'views', 'assets/image/favicon.ico'),
            project: app.project,
            filename: 'index.html',
            template: path.resolve(rootdir, 'views', 'index.html'),
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: "common",
            async: true,
            children: true,
            // filename: "[name].bundle.js"
        }),
        new ExtractTextPlugin('bundle.css'),
        new webpack.DllReferencePlugin({
            context: rootdir,
            manifest: path.join(rootdir, dist, 'dll', 'vendor-manifest.json')
        })
    ]
};

module.exports = conf;
