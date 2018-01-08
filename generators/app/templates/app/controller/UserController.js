'use strict';
var passport = require('koa-passport');
var logger = require('../util/Logger').logger('UserController');
var ResponseBean = require('../bean/ResponseBean');
var ConstantBean = require('../bean/ConstantBean');
var Restify = require('../util/Restify');

const util = require('../util/index');

const URL = {
    USER_INFO: '/users/{0}', // 获取、更新用户信息,
    UPDATE_PSW: '/users/{0}/updatePsw' // 更新密码
};

let _promisify4Signin = function (ctx, next) {
    return new Promise(resolve => {
        let callback = function (err, result) {
            let bean = new ResponseBean();
            // 若验证失败
            if (err || !result) {
                bean.status = ResponseBean.STATUS.AUTH_ERROR;
                bean.msg = err || result;
                logger.error('Sign in failed!', err, result);
                resolve(bean);
                return;
            }
            // 将User存储到Session
            // 通过ctx.state.user获取
            ctx.login(result, async (err) => {
                if (err) {
                    logger.error('Serialize user into Session failed!', err);
                    bean.status = ResponseBean.STATUS.UNKNOWN_ERR;
                    bean.msg = err;
                } else {
                    // 应当只暴露用到的属性
                    let { loginName, full, fuzzy, userName } = result;
                    let appStatusList = await ConstantBean.getAppStatus();
                    bean.data = {
                        appStatusList,
                        loginName,
                        full,
                        fuzzy,
                        userName
                    };
                }
                resolve(bean);
            });
        };
        passport.authenticate('local', callback)(ctx, next);
    });
};

/**
 * 用户登录
 */
exports.signin = async function (ctx, next) {
    let result = await _promisify4Signin(ctx, next);
    ctx.body = result;
};

/**
 * 用户登出
 */
exports.signout = async function (ctx, next) {
    ctx.logout();
    ctx.session.passport = null;
    delete ctx.session['passport'];
    ctx.body = new ResponseBean(ResponseBean.STATUS.OK, '登出成功');
};

/**
 * 用户列表
 */
exports.list = async function (ctx, next) {
    ctx.body = new ResponseBean(ResponseBean.STATUS.OK, "成功获取用户列表信息！", [{ user: 'aa' }]);
};

/**
 * 获取验证码
 */
exports.captcha = async function (ctx, next) {
    var captcha = util.createCaptcha();
    ctx.session.captcha = captcha.text;
    ctx.type = 'image/svg+xml';
    ctx.status = 200;
    ctx.body = new Buffer(captcha.data);
};

/**
 * 获取用户信息
 */
exports.getInfo = async function (ctx, next) {
    let userId = ctx.state.user.userId;
    let url = util.format(URL.USER_INFO, userId);
    let restify = new Restify(ctx);
    let ret = await restify.get(url);
    let bean = new ResponseBean();
    if (ret.code === 200) {
        let result = {
            userName: ret.data.userName,
            loginName: ret.data.loginName,
            phone: ret.data.phone,
        };
        bean.data = result;
    } else if (ResponseBean.RET_TO_STATUS[ret.code]) {
        bean.status = ResponseBean.RET_TO_STATUS[ret.code];
        bean.msg = ResponseBean.STATUS_MESSAGE[bean.status];
    } else {
        // 未知情况
        bean.status = ResponseBean.STATUS.UNKNOWN_ERR;
        bean.msg = ResponseBean.STATUS_MESSAGE[bean.status];
    }
    ctx.body = bean;
};

/**
 * 更新用户信息
 */
exports.putInfo = async function (ctx) {
    let params = ctx.request.body,
        userName = params.userName,
        phone = params.phone;

    // 检查联系人是否符合规则：数字，字母，汉字，下划线
    let userNameReg = /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/;
    if (!userNameReg.test(phone)) {
        logger.error(ResponseBean.STATUS_MESSAGE[ResponseBean.STATUS.VALIDATION_ERROR], '联系人只能包含数字、字母、汉字、下划线');

        ctx.body = new ResponseBean(ResponseBean.STATUS.VALIDATION_ERROR, ResponseBean.STATUS_MESSAGE[ResponseBean.STATUS.VALIDATION_ERROR]);
        return;
    }

    // 检查电话是否符合规则
    let phoneReg = /(^1[3|4|5|7|8]\d{9}$)|(^09\d{8}$)/;
    if (!phoneReg.test(phone)) {
        logger.error(ResponseBean.STATUS_MESSAGE[ResponseBean.STATUS.VALIDATION_ERROR], '电话不符合规则');

        ctx.body = new ResponseBean(ResponseBean.STATUS.VALIDATION_ERROR, ResponseBean.STATUS_MESSAGE[ResponseBean.STATUS.VALIDATION_ERROR]);
        return;
    }

    let userId = ctx.state.user.userId;

    let url = util.format(URL.USER_INFO, userId);

    let restify = new Restify(ctx);
    restify.setPath(url);

    // 发送请求
    let ret = await restify.put({
        userName: userName,
        phone: phone
    });
    let bean = new ResponseBean();
    if (ret.code === 200) {
        bean.msg = ret.msg;
    } else if (ResponseBean.RET_TO_STATUS[ret.code]) {
        bean.status = ResponseBean.RET_TO_STATUS[ret.code];
        bean.msg = ResponseBean.STATUS_MESSAGE[bean.status];
    } else {
        // 未知情况
        bean.status = ResponseBean.STATUS.UNKNOWN_ERR;
        bean.msg = ResponseBean.STATUS_MESSAGE[bean.status];
    }
    ctx.body = bean;
};

/**
 * 更新密码
 */
exports.updatePsw = async function (ctx) {
    let params = ctx.request.body,
        newpsw = params.newPsw,
        oldpsw = params.oldPsw,
        userId = ctx.state.user.userId;

    // 检查密码是否包含空格
    if (newpsw.indexOf(' ') !== -1) {
        logger.error(ResponseBean.STATUS_MESSAGE[ResponseBean.STATUS.VALIDATION_ERROR], '密码中不能包含空格');

        ctx.body = new ResponseBean(ResponseBean.STATUS.VALIDATION_ERROR, ResponseBean.STATUS_MESSAGE[ResponseBean.STATUS.VALIDATION_ERROR]);
        return;
    }

    let url = util.format(URL.UPDATE_PSW, userId);

    let restify = new Restify(ctx);
    restify.setPath(url);

    // 发送请求
    let ret = await restify.put({
        oldpsw: oldpsw,
        newpsw: newpsw
    });
    let bean = new ResponseBean();
    if (ret.code === 200) {
        bean.msg = ret.msg;
    } else if (ResponseBean.RET_TO_STATUS[ret.code]) {
        bean.status = ResponseBean.RET_TO_STATUS[ret.code];
        bean.msg = ResponseBean.STATUS_MESSAGE[bean.status];
    } else {
        // 未知情况
        bean.status = ResponseBean.STATUS.UNKNOWN_ERR;
        bean.msg = ResponseBean.STATUS_MESSAGE[bean.status];
    }
    ctx.body = bean;
};
