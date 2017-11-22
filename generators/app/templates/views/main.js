'use strict';
import Vue from 'vue'
import Vuebar2 from './components/common/vuebar/vuebar2.js';
import VueRouter from 'vue-router'
import ElementUI from 'element-ui'
import router from './routes'
import LayoutView from './layout.vue'
// 全局引入
import IOT from 'IOT'
import jquery from 'jquery'
import './assets/less/normalize.css'
import './assets/fontello/css/fontello.css'
import './components/common/vuebar/vuebar2.less'
import './assets/less/element-theme/index.css'
import './assets/less/common.less'

Vue.use(Vuebar2);
Vue.use(VueRouter);
Vue.use(ElementUI);

// 暴露到全局对象
window.IOT = IOT;
window.$ = jquery;
window.jquery = jquery;
window.jQuery = jquery;

router.beforeEach(async (to, from, next) => {
    // 校验页面访问权限
    let path = to.path;
    // 若为白名单
    if (path === '/404' || path === '/login') {
        return next();
    }
    // 向后端验证访问权限
    let result = await IOT.auth(path);
    if (!result.isLogin) {
        next('/login');
    } else if (!result.isAuth) {
        console.error(`没有访问权限 - [${path}]`);
        next('/404');
    } else {
        next();
    }
});

new Vue({
    el: '#layout',
    router: router,
    render: function (create) {
        return create(LayoutView);
    }
});
