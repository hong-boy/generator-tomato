'use strict';

const StatusCode = {
    OK: 200,
    UNKNOWN_ERR: -1, // 以下未列举出的其他情况所产生的错误
    API_ERROR: -2, // 程序调用外部api接口超时，返回数据错误等
    DB_ERROR: -3, // 数据库连接超时、失败等
    AUTH_ERROR: -4, // 用户访问系统资源无权限产生的错误、用户登录错误、token过期等
    SYS_ERROR: -5, // 系统处理异常
    BIZ_ERROR: -6, // 具体项目涉及到的业务处理相关的错误
    VALIDATION_ERROR: -7, // 参数校验失败
};

StatusCode.Message = {
    '200': '成功',
    '-1': '未知错误',
    '-2': 'API接口错误',
    '-3': '数据库连接错误',
    '-4': '访问权限错误',
    '-5': '系统错误',
    '-6': '业务错误',
    '-7': '参数校验错误',
};

module.exports = StatusCode;
