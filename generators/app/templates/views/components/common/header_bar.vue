<template>
    <div class="header-bar">
        <div class="container">
            <div class="flex-wrap">
                <div class="header-bar-logo">
                    <router-link to="/index"><img src="../../assets/image/OneNET.png" alt="OneNET"></router-link>
                    <span>|</span>
                    <span>{{name}}</span>
                </div>
                <div class="header-bar-nav">
                    <el-menu ref="menu" mode="horizontal" :router="true" :defaultActive="defaultMenu">
                        <el-menu-item index="/index" v-if="auth4Page('/index')">首页</el-menu-item>
                        <el-submenu index="/app" v-if="auth4Page('/app')">
                            <template slot="title">应用管理</template>
                            <el-menu-item index="/app/list" v-if="auth4Page('/app/list')">应用列表</el-menu-item>
                            <el-menu-item index="/app/check" v-if="auth4Page('/app/check')">应用审核</el-menu-item>
                        </el-submenu>
                        <el-submenu index="/account" v-if="auth4Page('/account')">
                            <template slot="title">账号管理</template>
                            <el-menu-item index="/account/lapp" v-if="auth4Page('/account/lapp')">轻应用管理员</el-menu-item>
                            <el-menu-item index="/account/manager" v-if="auth4Page('/account/manager')">管理系统账号</el-menu-item>
                        </el-submenu>
                        <el-submenu index="/settings" v-if="auth4Page('/settings')">
                            <template slot="title">系统设置</template>
                            <el-menu-item index="/settings/doc" v-if="auth4Page('/settings/doc')">文档中心</el-menu-item>
                            <el-menu-item index="/settings/attach" v-if="auth4Page('/settings/attach')">附件下载</el-menu-item>
                            <el-menu-item index="/settings/resource" v-if="auth4Page('/settings/resource')">内容设置</el-menu-item>
                            <el-menu-item index="/settings/feedback" v-if="auth4Page('/settings/feedback')">用户反馈</el-menu-item>
                        </el-submenu>
                        <el-menu-item index="/demo" v-if="auth4Page('/demo')">Demo展示</el-menu-item>
                    </el-menu>
                </div>
                <div class="header-bar-right">
                    <el-dropdown>
                        <span class="el-dropdown-link">
                            <i class="icon-user"></i>
                            {{username}}
                            <i class="icon-arrow-down"></i>
                        </span>
                        <el-dropdown-menu class="header-dropdown" slot="dropdown">
                            <el-dropdown-item>
                                <router-link to="/index/user">账号设置</router-link>
                            </el-dropdown-item>
                            <el-dropdown-item>
                                <router-link to="/index/pwd">修改密码</router-link>
                            </el-dropdown-item>
                            <el-dropdown-item>
                                <router-link to="/logout">退出</router-link>
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    export default {
        created () {
            let thiz = this;
            // 控制菜单样式
            // let userInfo = IOT.loadUserInfo();
            let userInfo = IOT.loadUserInfoLocalStorage();
            thiz.defaultMenu = (userInfo && userInfo.defaultMenu);
            this.$router.afterEach(function (to, from) {
                let path = to.fullPath;
                let arr = path.split('\/').slice(0, 3);
                thiz.defaultMenu = `${arr.join('/')}`;
                // let userInfo = IOT.loadUserInfo();
                let userInfo = IOT.loadUserInfoLocalStorage();
                userInfo.defaultMenu = thiz.defaultMenu;
                // IOT.restoreUserInfo(userInfo);
                IOT.restoreUserInfoLocalStorage(userInfo);
            });
        },
        data () {
            // let {userName, loginName} = IOT.loadUserInfo();
            let { userName, loginName } = IOT.loadUserInfoLocalStorage();

            return {
                name: '轻应用平台管理系统',
                username: userName,
                defaultMenu: '/index',
            };
        },
        methods: {
            auth4Page (url) {
                return IOT.auth4Page(url);
            }
        }
    }
</script>

<style lang="less">
    .header-bar {
      color: #fff;
      line-height: 68px;

      .flex-wrap {
        display: flex;

        .header-bar-nav {
          flex: 1;
          display: inline-flex;
        }
        .header-bar-right {
          min-width: 120px;
        }
      }

      .header-bar-logo {
        height: 100%;
        width: 400px;
        img {
          position: relative;
          top: 4px;
        }
        span {
          font-size: 24px;
        }
      }
      .header-bar-right {
        text-align: right;
        @media screen and (max-width: 1220px) {
          text-align: center;
        }
        .el-dropdown {
          color: #fff;
          font-size: 16px;
        }
      }

      // 一级目录
      .header-bar-nav > .el-menu {
        background-color: #00b8ff;

        border: none;
        & > li .el-submenu__title,
        & > .el-menu-item {
          font-size: 16px;
          height: 70px;
          line-height: 70px;
        }

        & > li,
        & > li .el-submenu__title {
          color: #fff !important;
          background-color: #00b8ff;
        }
        & > li .el-submenu__title i {
          display: none;
        }

        .el-submenu__title:hover,
        & > .el-menu-item:hover {
          background-color: #00b8ff;
        }
      }

      // 二级目录
      .el-submenu .el-menu-item {
        color: #48576a;
        min-width: initial;
        text-align: center;

        &:hover {
          background-color: #e6f8ff;
          color: #33c6ff;
        }
      }
      .el-submenu .is-active {
        color: #33c6ff;
      }
    }

    ul.header-dropdown {
      text-align: center;
      li {
        padding: 0;
      }
      a {
        color: #48576a;
        text-decoration: none;
        font-size: 14px;
        line-height: 36px;
        display: inline-block;
        padding: 0 20px;
      }

      li:hover a,
      a:hover {
        color: #48576a;
      }
      a:visited {
        color: #48576a;
      }
    }
</style>
