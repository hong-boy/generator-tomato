'use strict';
let moment = require('moment');
let svgCaptcha = require('svg-captcha-smooth');

/**
 * 将日期对象转换为格式化时间字符串
 * @param{Date|Number} date
 * @param{String} format
 */
exports.date2String = function (date, format = 'YYYY-MM-DD HH:mm:ss') {
    return moment(date).format(format);
};

/**
 * 将字符串转换为Date对象
 * @param{String} str
 * @param{String} format 日期格式
 */
exports.string2Date = function (str, format = 'YYYY-MM-DD HH:mm:ss') {
    return moment(str, format).toDate();
};

/**
 * 生成验证码（默认4位）
 * @param{Object} option
 * @returns {option}
 */
exports.createCaptcha = function (option = {noise: 25}) {
    return svgCaptcha.create(option);
};

/**
 * 格式化字符串
 * Usage:
 * pageNum = 1;
 * pageSize = 10;
 * /appInfos?pageNum={0}&pageSize={1} ==> /appInfos?pageNum=1&pageSize=10
 * @param str
 * @param args
 * @returns {*}
 */
exports.format = function (str, ...args) {
    if (typeof str !== 'string') {
        return str;
    }
    let temp = str;
    [].concat(args).forEach((item, i) => {
        let regx = new RegExp("\\{" + i + "\\}", "g");
        temp = temp.replace(regx, item);
    });
    return temp;
};

exports.Logger = require('./Logger.js');
exports.Store = require('./Store.js');
exports.Restify = require('./Restify.js');
exports.Stopwatch = require('./Stopwatch.js');
