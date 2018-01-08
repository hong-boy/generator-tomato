import {fetch} from './fetch'
import lodash from 'lodash'
import NProgress from 'nprogress'
import {Message, Loading} from 'element-ui';
import Loading2 from '../components/common/vloading2/Loading';

const NAMESPACE = 'baasbs';

/**
 * 将key用NAMESPACE包装
 * @param key
 * @private
 */
let _getNamespaceKey = function (key) {
    return [NAMESPACE, key].join('-')
};

/**
 * 从sessionStorage获取用户信息
 */
let loadUserInfo = function () {
    return loadSession('userInfo');
};

/**
 * 从localStorage获取用户信息
 */
let loadUserInfoLocalStorage = function () {
    return loadLocalStorage('userInfo');
};

/**
 * 存储用户信息 - session
 * @param user
 */
let restoreUserInfo = function (user) {
    restoreSession('userInfo', user);
};

/**
 * 存储用户信息 - local
 * @param user
 */
let restoreUserInfoLocalStorage = function (user) {
    restoreLocalStorage('userInfo', user);
};

/**
 * 移除用户信息 - session
 */
let removeUserInfo = function () {
    removeSession('userInfo');
};

/**
 * 移除用户信息 - local
 */
let removeUserInfoLocalStorage = function () {
    removeLocalStorage('userInfo');
};

/**
 * 获取sessionstorage中存储的对象
 * @param key
 */
let loadSession = function (key) {
    let value = window.sessionStorage.getItem(_getNamespaceKey(key));
    try {
        value = JSON.parse(value);
    } catch (e) {
        // 不是JSON字符串
    }
    return value;
};

/**
 * 获取localstorage中存储的对象
 * @param key
 */
let loadLocalStorage = function (key) {
    let value = window.localStorage.getItem(_getNamespaceKey(key));
    try {
        value = JSON.parse(value);
    } catch (e) {
        // 不是JSON字符串
    }
    return value;
};

/**
 * 向sessionstorage存储对象
 * @param key
 * @param value
 */
let restoreSession = function (key, value) {
    window.sessionStorage.setItem(
        _getNamespaceKey(key),
        lodash.isPlainObject(value) || lodash.isArray(value) ? JSON.stringify(value) : value
    );
};

/**
 * 向localstorage存储对象
 * @param key
 * @param value
 */
let restoreLocalStorage = function (key, value) {
    window.localStorage.setItem(
        _getNamespaceKey(key),
        lodash.isPlainObject(value) || lodash.isArray(value) ? JSON.stringify(value) : value
    );
};

/**
 * 从sessionstorage移除对象
 * @param key
 */
let removeSession = function (key) {
    window.sessionStorage.removeItem(_getNamespaceKey(key));
};

/**
 * 从localstorage移除对象
 * @param key
 */
let removeLocalStorage = function (key) {
    window.localStorage.removeItem(_getNamespaceKey(key));
};

/**
 * 从后端校验页面访问权限
 * @param path
 * @returns {{isLogin: boolean, isAuth: boolean}}
 */
let auth = async function (path) {
    let result = {isLogin: false, isAuth: false};
    try {
        let bean = await fetch('/auth', {path: path});
        result = bean.data;
    } catch (e) {
        console.error(e);
    }
    return result;
};

/**
 * 页面权限校验
 * （用于UI展示）
 * @param pageUrl
 * @returns {boolean}
 */
let auth4Page = function (pageUrl) {
    let flag = false,
        // user = loadUserInfo() || {};
        user = loadUserInfoLocalStorage() || {};
    flag = lodash.includes([].concat(user.full, user.fuzzy), pageUrl);
    return flag;
};

/**
 * 跳转至首页
 * @param{$router} router vue-router实例
 */
let redirect2Home = function (router) {
    if (router) {
        router.push('index');
        return;
    }
    location.href = 'index';
};

/**
 * 跳转至404页面
 * @param{$router} router vue-router实例
 */
let redirect2NotFound = function (router) {
    if (router) {
        router.push('404');
        return;
    }
    location.href = '404';
};

/**
 * 用户登出
 * @returns {Promise}
 */
let signout = function () {
    // removeUserInfo();
    removeUserInfoLocalStorage();
    return fetch('/logout');
};

/**
 * 显示Loading加载效果（默认Loading2）
 * @param option {
 *  type: {type:string, desc:Loading框类型, enum:[Loading, Loading2, NProgress]}
 * }
 * 当option.type=Loading, option={text:'', spinner:'', target:''}
 * 当option.type=Loading2, option={timeout:'', background:'', target:''}
 * 当option.type=NProgress, option={}
 */
let showLoading = function (option) {
    let inst = null;
    switch(option.type){
        case 'NProgress': {
            inst = showLoading3();
            break;
        }
        case 'Loading': {
            inst = showLoading1(option);
            break;
        }
        case 'Loading2': {
        }
        default: {
            inst = showLoading2(option);
            break;
        }
    }
    return inst;
};

/**
 * 显示loading加载
 */
let showLoading1 = function (option) {
    let defaults = {text: '加载中', spinner: 'el-icon-loading', target: '.page'};
    if (option && option.spinner === false) {
        option.text = '';
    }
    option = Object.assign({}, defaults, option);
    return Loading.service(option);
};

/**
 * Loading2
 * @param option
 * @returns {*}
 */
let showLoading2 = function (option) {
    option = lodash.extend({target:document.querySelector('body'), background:'transparent'}, option);
    option.visible = true;
    return Loading2.service(option.target, option);
};

/**
 * NProgress
 * @param option
 * @returns {*}
 */
let showLoading3 = function (option) {
    return NProgress.start().set(0.7)
};

/**
 * 关闭loading加载
 * @param inst
 */
let closeLoading = function (inst) {
    if (!inst) {
        console.warn('[inst] is null or empty!', inst);
        return;
    }
    if(typeof inst.close === 'function'){
        inst.close();
    }else if(inst instanceof Loading2){
        Loading2.destroy(inst);
    }else if(typeof inst.done === 'function'){
        inst.done().remove();
    }else {
        throw Error(`[inst] is illegal!`, inst);
    }
};

/**
 * 显示消息提示框
 * @param msg
 * @param type 默认值：'error'
 * @param duration
 * @param onclose 关闭时的回调
 * @return {*}
 */
let showMessage = function (msg, type, duration, onclose) {
    let defaults = {duration: 3000, type: 'error', showClose: true};
    let option;
    if (lodash.isPlainObject(msg)) {
        option = msg;
    } else {
        option = {
            message: msg,
            type,
            duration,
            onClose: onclose
        };
    }
    if (!option.message) {
        throw Error('[message] is required');
    }
    option = lodash.merge({}, defaults, option);
    return Message(option);
};

/**
 * 关闭消息提示框
 * @param inst
 */
let closeMessage = function (inst) {
    if (!inst) {
        console.warn('[inst] is null or empty!', inst);
        return;
    }
    inst.close();
};

export default {
    fetch,
    loadUserInfo,
    loadUserInfoLocalStorage,
    removeUserInfo,
    removeUserInfoLocalStorage,
    restoreUserInfo,
    restoreUserInfoLocalStorage,
    loadSession,
    loadLocalStorage,
    restoreSession,
    removeSession,
    auth,
    auth4Page,
    redirect2Home,
    redirect2NotFound,
    signout,
    showLoading,
    closeLoading,
    showMessage,
    closeMessage,
    showLoading2
}
