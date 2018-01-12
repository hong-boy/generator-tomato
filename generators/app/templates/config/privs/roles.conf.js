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
    '2': {
        name: "轻应用管理员",
        privs: (process.env && (process.env.NODE_ENV_BAAS==='uat'||process.env.NODE_ENV_BAAS==='production')) ?
            ['01', '02', '03']
            : ['01', '02', '03', '04']
    }
};
