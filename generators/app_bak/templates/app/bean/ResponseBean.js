'use strict';
const StatusCode = require('./StatusCode.js');
/**
 * 用于封装传递给前端的数据
 */
class ResponseBean {
    constructor(status, msg, data) {
        /**
         * 状态码（代表该次操作成功与否）
         * @type {*|number}
         */
        this.status = status || 200;
        this.msg = msg || '';
        this.data = data || null;
    }

    toString() {
        return `{"status":${this.status}, "msg":${this.msg}, "data":${JSON.stringify(this.data)}}`;
    }
}

ResponseBean.STATUS = StatusCode;
ResponseBean.STATUS_MESSAGE = StatusCode.Message;

module.exports = ResponseBean;
