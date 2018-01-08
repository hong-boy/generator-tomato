'use strict';
const passport = require('koa-passport');
const lodash = require('lodash/object');
const conf = require('../privs.js');
const StoreUtil = require('../../app/util/Store');
const Restify = require('../../app/util/Restify');
const PREFIX_4_ROLE = 'ROLE';
const env = require('../env.js');
const MAXAGE_4_ROLE = env.session.maxAge;
const isDebug = !!env.debug;
const bsAdminId = 1;//后台管理员roleId为固定值1

/**
 * 根据用户角色ID获取用户权限
 * @param roleId
 * @returns {{fuzzy: Array, full: Array}}
 */
async function processPrivsUrl(roleId) {
    let result = {fuzzy: [], full: []},
        sid = `${PREFIX_4_ROLE}:${roleId}`,
        cache = await StoreUtil.get(sid);

    if (cache) {
        return cache;
    }

    let privsList = conf.roles[roleId].privs,
        cFull = conf.privs.full,
        cFuzzy = conf.privs.fuzzy;
    privsList.forEach(pid => {
        if (cFull[pid]) {
            result.full.push(cFull[pid]);
        } else if (cFuzzy[pid]) {
            result.fuzzy.push(cFuzzy[pid]);
        } else {
            // do nothing
        }
    });
    // 缓存角色对象
    StoreUtil.set(sid, result, MAXAGE_4_ROLE);

    return result;
}

/**
 * 获取用户信息
 * @param username
 * @param password
 * @returns {Promise}
 */
async function fetchUser(username, password) {
    let restify = new Restify();
    let result = {
        err: false,
        user: null,
        msg: null,
    };
    let ret = await restify.get(`/login?uname=${username}&psw=${password}&roleId=${bsAdminId}`);
    if (ret.code != 200) {
        result.err = ret.code;
        result.msg = ret.msg;
        return result;
    }

    if (!ret.data) {
        result.err = ret.code;
        result.msg = ret.msg || '用户名或密码错误';
        return result;
    }

    if (ret.data.roleId != bsAdminId) {
        result.err = 403;
        result.msg = '无权限登录此系统！';
        return result;
    }

    result.err = ret.code; // 200
    result.user = ret.data;
    let privs = await processPrivsUrl(result.user.roleId);
    result.user = lodash.assign({access_token: ret.access_token}, result.user, privs);
    console.debug(result);
    return result;
}

/**
 * 验证码校验
 * @param req
 * @returns {string}
 */
function verifyCaptcha(req) {
    if (isDebug) {
        // 开发环境下跳过验证码校验
        return;
    }
    let captchaSess = req.session.captcha;
    let captchaBody = req.body.captcha;
    if (!captchaBody) {
        return '验证码不能为空';
    }
    if (!captchaSess || captchaSess.toUpperCase() !== captchaBody.toUpperCase()) {
        return '验证码错误';
    }
}

/**
 * Registers a function used to serialize user objects into the session.
 */
passport.serializeUser(function (user, done) {
    done(null, user)
});

/**
 * Registers a function used to deserialize user objects out of the session.
 */
passport.deserializeUser(function (user, done) {
    done(null, user)
});

/**
 * 本地
 * @type {Strategy}
 */
const LocalStrategy = require('passport-local').Strategy;
passport.use(new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    },
    async function (req, username, password, done) {
        // 1. 判断图形验证码
        let errmsg = verifyCaptcha(req);
        req.session.captcha = undefined; // 验证码置空
        if (errmsg) {
            done(errmsg, undefined);
            return;
        }
        // 2. 验证用户名&密码
        let result = await fetchUser(username, password);
        if (result.err == 200) {
            done(undefined, result.user);
        } else {
            done(result.msg, undefined);
        }
    }));
