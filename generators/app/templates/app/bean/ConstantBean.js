'use strict';
let StoreUtil = require('../util/Store');
/**
 * 应用状态枚举
 */
const APP_STATUS = {
    '1': '待完成',
    '2': '待启用',
    '3': '已启用',
    '4': '已停止',
    // '5': '已删除',
    '6': '待审核',
    '7': '审核未通过',
    '8': '待修改完成'
};

const APP_CHECK_STATUS = {
    '0': '未审核',
    '1': '通过',
    '2': '未通过'
};

module.exports = class ConstantBean {
    /**
     * 获取应用状态枚举
     * 异步方法
     * @returns {Promise.<*>}
     */
    static async getAppStatus() {
        const tag = 'APP_STATUS';
        let statusList = await StoreUtil.get(tag);
        if (!statusList) {
            await StoreUtil.set(tag, APP_STATUS);
            statusList = APP_STATUS;
        }
        return statusList;
    }
    static async getCheckAppStatus() {
        const tag = 'APP_CHECK_STATUS';
        let checkStatusList = await StoreUtil.get(tag);
        if (!checkStatusList) {
            await StoreUtil.set(tag, APP_CHECK_STATUS);
            checkStatusList = APP_CHECK_STATUS;
        }
        return checkStatusList;
    }
};
