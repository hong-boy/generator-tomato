'use strict';
var passport = require('koa-passport');
var logger = require('../util/Logger').logger('UserController');
var ResponseBean = require('../bean/ResponseBean');

const util = require('../util/index');

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
            ctx.login(result, (err) => {
                if (err) {
                    logger.error('Serialize user into Session failed!', err);
                    bean.status = ResponseBean.STATUS.UNKNOWN_ERR;
                    bean.msg = err;
                } else {
                    // 应当只暴露用到的属性
                    let {loginName, full, fuzzy, userName} = result;
                    bean.data = {
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
    ctx.body = new ResponseBean(ResponseBean.STATUS.OK, '登出成功');
};

/**
 * 用户列表
 */
exports.list = async function (ctx, next) {
    ctx.body = new ResponseBean(ResponseBean.STATUS.OK, "成功获取用户列表信息！", [{user: 'aa'}]);
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
