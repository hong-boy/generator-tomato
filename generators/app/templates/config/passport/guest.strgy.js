'use strict';
const passportStrategy = require('passport-strategy');
const util = require('util');
const passport = require('koa-passport');
const lodash = require('lodash/object');
const conf = require('../privs.js');
const StoreUtil = require('../../app/util/Store');
const PREFIX_4_ROLE = 'ROLE';
const env = require('../env.js');
const MAXAGE_4_ROLE = env.session.maxAge;
const ADMIN_ROLE_ID = 3;//游客roleId为固定值3

/**
 * 自定义策略 - 游客登录
 * @param verify
 * @constructor
 */
function Strategy(verify) {
    if (!verify) {
        throw new TypeError('GuestStrategy requires a verify callback');
    }
    passportStrategy.Strategy.call(this);
    this.name = 'guest';
    this._verify = verify;
}

util.inherits(Strategy, passportStrategy.Strategy);

Strategy.prototype.authenticate = function () {
    var thiz = this;
    thiz._verify(function (user, info) {
        Object.defineProperty(user, 'anonymous', {
            value: true,
            writable: false,
            enumerable: false,
            configurable: false
        });
        thiz.success(user, info);
    });
};



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
 * 游客
 * @type {Strategy}
 */
const GuestStrategy = Strategy;
module.exports = new GuestStrategy(async function (done) {
    let result = {
        err: 200,
        user: {
            anonymous: true,
            role: ADMIN_ROLE_ID //游客
        },
        info: 'success'
    };
    let {full, fuzzy} = await processPrivsUrl(result.user.role);
    result.user.full = full;
    result.user.fuzzy = fuzzy;
    done(result.user);//req.user.anonymous=true
});

