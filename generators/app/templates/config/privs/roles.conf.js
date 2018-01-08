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
        privs: (process.env && (process.env.NODE_ENV_BAAS==='uat'||process.env.NODE_ENV_BAAS==='production')) ?
            ['01', '02', '0201', '0202', '03', '0301', '0302']
            : ['01', '02', '0201', '0202', '03', '0301', '0302', '04', '0401', '0402', '0403', '05']
    }
};
