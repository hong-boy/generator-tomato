'use strict';
/**
 * 定义系统角色
 * @usage
 *  {
 *    ROLE_ID: {
 *      ROLE_NAME: '',
 *      PRIVS_LIST: [PRIVS_ID]
 *    }
 *  }
 */
module.exports = {
    '1': {
        name: "后台管理员",
        privs: ['01', '02']
    }
};
