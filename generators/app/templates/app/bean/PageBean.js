'use strict';

/**
 * 分页实体
 * @type {PageBean}
 */
module.exports = class PageBean {
    constructor(list = [], total = 0, pageNum = 1, pageSize = 10, msg) {
        /**
         * 数据列表
         * @type {Array}
         */
        this.list = list;
        /**
         * 总条数
         * @type {number}
         */
        this.total = total;
        /**
         * 当前页号
         * @type {number}
         */
        this.pageNum = pageNum;
        /**
         * 页长
         * @type {number}
         */
        this.pageSize = pageSize;
        /**
         * 文本消息
         */
        this.msg = msg;
    }
};
