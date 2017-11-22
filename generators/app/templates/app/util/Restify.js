'use strict';
let request = require('request');
let lodash = require('lodash');
const logger = require('./Logger').logger('Restify');
const Stopwatch = require('./Stopwatch');
const StatusCode = require('../bean/StatusCode');
const OPTION = require('../../config/env.js')['webservice'];

function _request(method, restify) {
    restify.addHeader('session-token', restify.getToken() || undefined);
    let path = restify.getPath();
    let option = lodash.defaultsDeep({}, OPTION, {
        method: method,
        uri: path,
        json: true,
        headers: restify.getHeaders(),
        body: restify.getBody()
    });
    logger.debug([
        'RESTful API request',
        'Method: ' + method.toUpperCase(),
        'Path: ' + path,
        'Params: ' + JSON.stringify(restify.getBody()),
        'Token: ' + restify.getToken()
    ].join(' | '));
    let promise = new Promise(resolve => {
        let watch = new Stopwatch();
        watch.start(path);
        request(option, function (err, res, body) {
            logger.info(watch.end());
            if (err || res.statusCode != StatusCode.OK) {
                resolve(_handleError(method, path, err || res));
                return;
            }
            res.headers['session-token'] && (body['access_token'] = res.headers['session-token']);
            logger.debug('Response data: %s', JSON.stringify(body));
            resolve(body);
        });
    });
    return promise;
}

function _handleError(method, path, err) {
    if (err.statusCode) {
        var msg = err.body ? JSON.stringify(err.body) : err.statusMessage;
        logger.error('Error happened when excute %s method - code: %d. Error message: %s', method, err.statusCode, msg);
        return {code: StatusCode.API_ERROR, msg: '远程服务器发生错误，数据操作失败！', statusCode: err.statusCode};
    } else if (err.code) {
        logger.error('[%s] - %s - problem with request: %s', method, path, err.message);
        var ret = {code: StatusCode.API_ERROR, msg: err.message};
        if (err.code === 'ECONNREFUSED' || err.code === 'read ECONNRESET') {
            ret.errmsg = ret.msg;
            ret.msg = '远程服务器连接错误！';
        }
        return ret;
    }
}

class Restify {
    constructor(ctx) {
        this.path = null;
        this.headers = {};
        this.token = null;
        this.body = null;
        this.ctx = ctx;
    }

    /**
     * RESTful - GET
     * @param path
     */
    get(path) {
        if (path) {
            this.setPath(path);
        }
        return _request('get', this);
    }

    /**
     * RESTful - POST
     */
    post(body) {
        if (body) {
            this.setBody(body);
        }
        return _request('post', this);
    }

    /**
     * RESTful - PUT
     */
    put(body) {
        if (body) {
            this.setBody(body);
        }
        return _request('put', this);
    }

    /**
     * RESTful - DELETE
     */
    del(body) {
        if (body) {
            this.setBody(body);
        }
        return _request('delete', this);
    }

    /**
     * 文件上传
     */
    upload() {
        let restify = this;
        let path = restify.getPath();
        restify.addHeader('access_token', restify.getToken());
        let option = lodash.defaultsDeep({}, OPTION, {
            uri: path,
            headers: restify.getHeaders(),
            formData: restify.getBody()
        });
        logger.debug([
            'RESTful API request',
            'Method: FileUpload',
            'Path: ' + path,
            'Params: ' + JSON.stringify(restify.getBody()),
            'Token: ' + restify.getToken()
        ].join(' | '));
        let promise = new Promise(resolve => {
            let watch = new Stopwatch(path);
            request.post(option, function (err, res, body) {
                logger.info(watch.end());
                if (err || res.statusCode != StatusCode.OK) {
                    logger.error('文件上传失败！%s', (err && err.message) || res.statusCode + res.statusMessage);
                    resolve({code: StatusCode.API_ERROR, msg: '文件上传失败！'});
                    return;
                }
                logger.debug('Response data: %s', JSON.stringify(body));
                resolve(body);
            });
        });
        return promise;
    }

    /**
     * 添加request header
     * @param key
     * @param value
     */
    addHeader(key, value) {
        this.headers[key] = value;
        return this;
    }

    /**
     * 获取header
     * @param key
     * @returns {*}
     */
    getHeader(key) {
        return this.headers[key];
    }

    /**
     * 获取headers
     * @returns {{}|*}
     */
    getHeaders() {
        return this.headers;
    }

    /**
     * 设置request访问路径
     * @param path
     */
    setPath(path) {
        this.path = path;
        return this;
    }

    /**
     * 获取路径
     * @returns {*|null}
     */
    getPath() {
        return this.path;
    }

    /**
     * 设置token
     * @param token
     */
    setToken(token) {
        this.token = token;
        return this;
    }

    /**
     * 获取token
     * @returns {null|*}
     */
    getToken() {
        if (!this.token && this.ctx && this.ctx.state && this.ctx.state.user) {
            this.token = this.ctx.state.user.access_token;
        }
        return this.token;
    }

    /**
     * 设置body参数
     * @param params
     */
    setBody(params) {
        this.body = params;
        return this;
    }

    /**
     * 获取参数
     * @returns {*|null}
     */
    getBody() {
        return this.body;
    }
}

module.exports = Restify;
