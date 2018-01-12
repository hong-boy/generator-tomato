'use strict';
import Vue from 'vue'
import NProgress from 'nprogress'
import Vuescrollbars from 'vue-scrollbars';
import VLoading2 from './components/common/vloading2/directive.js';
import VueRouter from 'vue-router'
import ElementUI from 'element-ui'
import router from './routes'
import LayoutView from './layout.vue'
// 全局引入
import IOT from 'IOT'
import jquery from 'jquery'
import echarts from 'echarts/lib/echarts'
import { line } from 'echarts'
import zrender from 'zrender'
import 'vue-scrollbars/dist/bundle.css';
import 'nprogress/nprogress.css'
import 'animate.css'
import './assets/less/normalize.css'
import './assets/fontello/css/fontello.css'
import './assets/less/element-theme/index.css'
import './assets/less/common.less'

Vue.use(Vuescrollbars);
Vue.use(VLoading2);
Vue.use(VueRouter);
Vue.use(ElementUI);

// 暴露到全局对象
window.IOT = IOT;
window.$ = jquery;
window.jquery = jquery;
window.jQuery = jquery;
window.zrender = zrender;
Vue.prototype.$echarts = echarts;

// 配置NProgress
NProgress.configure({
    showSpinner: false
});

router.beforeEach(async (to, from, next) => {
    NProgress.start();
    NProgress.set(0.4);
    // 校验页面访问权限
    let path = to.path;
    // 若为白名单
    if (path === '/404' || path === '/login' || path === '/index' || path === '/wiki') {
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

router.afterEach(() => {
    NProgress.done();
});

new Vue({
    el: '#layout',
    router: router,
    render: function (create) {
        return create(LayoutView);
    }
});
