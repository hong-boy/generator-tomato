'use strict';
/**
 * 系统权限列表
 * @usage
 * {
 *  PRIVS_ID: {
 *    PRIVS_NAME: '',
 *    PRIVS_URLS: [], // 权限URL（即：后端（即：Node端）路由path）注意：后端接受到的GET请求均
 *    //被connect-api-history-fallback拦截，并将此请求转发给vue-router，故后端业务中间件只会接受到POST请求。
 *    FUZZY: false, // 是否对PRIVS_URLS采取模糊匹配，true-是 false-否（默认：false）
 *    CHILDREN: { // 子权限，例如：子权限A和子权限B都是权限C的子权限，则能够访问子权限A或者B的前提条件是：先拥有权限C
 *      // ...
 *    }
 *  }
 * }
 */
module.exports = {
    '01': {
        name: '首页',
        urls: '/index',
        fuzzy: true
    },
    '02': {
        name: '应用管理',
        urls: '/app',
        children: {
            '0201': {
                name: '应用列表',
                urls: '/app/list',
                fuzzy: true
            },
            '0202': {
                name: '应用审核',
                urls: '/app/check',
                fuzzy: true
            }
        }
    },
    '03': {
        name: '账号管理',
        urls: '/account',
        children: {
            '0301': {
                name: '轻应用管理员',
                urls: '/account/lapp',
                fuzzy: true
            },
            '0302': {
                name: '后台管理员',
                urls: '/account/manager',
                fuzzy: true
            }
        }
    },
    '04': {
        name: '系统设置',
        urls: '/settings',
        children: {
            '0401': {
                name: '文档中心',
                urls: '/settings/doc',
                fuzzy: true
            },
            '0402': {
                name: '附件下载',
                urls: '/settings/attach',
                fuzzy: true
            },
            '0403': {
                name: '内容设置', // 控制轻应用配置平台首页banner、企业合作伙伴图片
                urls: '/settings/resource',
                fuzzy: true
            },
            '0404': {
                name: '用户反馈',
                urls: '/settings/feedback',
                fuzzy: true
            }
        }
    },
    '05': {
        name: 'Demo页面',
        urls: '/demo',
        fuzzy: true
    }
};
