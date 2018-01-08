// import es6Promise from 'es6-promise'
import iFetch from 'isomorphic-fetch'
import _ from 'lodash'

// es6Promise.polyfill(); // 浏览器兼容Promise

const BASE_API_URL = '';

const regx4url = /^\//;

const OPTIONS = {
    method: 'POST',
    body: null,
    mode: 'same-origin',
    cache: 'default',
    credentials: 'include', // 开启cookie支持
    headers: {
        'X-Requested-With': 'Fetch', //兼容express4 req.xhr
        'Connection': 'keep-alive',
        'Content-Type': 'application/json; charset=UTF-8'
    }
};

function _formatUrl(url) {
    return [BASE_API_URL, url].join('').replace(regx4url, '');
}

function _handleResponse(resp) {
    if (resp.status === 200) {
        // 默认只处理JSON
        return resp.json();
    }

    if (resp instanceof Error) {
        // 网络超时
        resp.status = 504;
    }

    let error = new Error();
    // 处理http request error
    switch (resp.status) {
        case 401: {
            // 没有权限
            Promise.resolve(resp.text()).then(function (ret) {
                IOT.showMessage(ret);
            });
            break;
        }
        case 408: {
            // session超时或者为空
            Promise.resolve(resp.text()).then(function (ret) {
                IOT.showMessage(ret, 'error', 2000, function () {
                    location.href = 'logout';
                });
            });
            break;
        }
        case 504: {
            // 网络超时
            error.status = 504;
            error.msg = resp.message;
            IOT.showMessage(`一般错误(${resp.message})`);
            console.error(resp);
            break;
        }
        default: {
            error.status = 500;
            error.msg = '一般错误';
        }
    }
    return error;
}

/**
 * 向后台请求JSON格式数据
 * @param url
 * @param data
 * @param{object} overlay 参考el-loading配置
 * @returns {Promise}
 */
export function fetch(url, data, overlay) {
    let loading;
    if (overlay) {
        loading = IOT.showLoading(overlay);
    }
    let option = _.extend({}, OPTIONS, {body: JSON.stringify(data)});
    let promise = new Promise(async (resolve, reject) => {
        let resp, result;
        try {
            resp = await iFetch(_formatUrl(url), option);
        } catch (e) {
            resp = e;
        } finally {
            loading && IOT.closeLoading(loading);
        }
        result = _handleResponse(resp);
        resolve(result);
    });
    return promise;
}
