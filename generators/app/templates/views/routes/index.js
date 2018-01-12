'use strict';
import VueRouter from 'vue-router'
import NotFoundPage from '../components/common/404.vue'
import DemoPage from '../components/demo_page/demo_page.vue'
import LoginPage from '../components/login_page/login.vue'
import HomePage from '../components/home_page/home_page.vue'
import WikiPage from '../components/wiki_page/wiki_page.vue'
import ConsolePage from '../components/console_page/console_page.vue'

const routes = [];

routes.push({ path: '/index', component: HomePage });
routes.push({ path: '/wiki', component: WikiPage });
routes.push({ path: '/login', component: LoginPage });
routes.push({ path: '/logout', redirect: '/login' });

// 控制台页面
let router4console = { path: '/console', component: ConsolePage, children: [] };
const component = router4console.children;
routes.push(router4console);
// component.push({ path: '/', component: ConsolePage });
component.push({ path: '/demo', component: DemoPage });

routes.push({ path: '/404', component: NotFoundPage });
routes.push({ path: '*', redirect: '/404' });

export default new VueRouter({
    mode: 'history', // 使用H5 history，需要配合router-link标签
    routes: routes
});
