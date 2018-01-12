<template>
    <div class="header-bar">
        <div class="container">
            <div class="logo pull-left">
                <router-link to="/index"><img src="../../assets/image/OneNET.png" alt="OneNET"></router-link>
                <span class="splitter"></span>
                <span>{{logoName}}</span>
            </div>
            <el-menu ref="menu" mode="horizontal" :router="true" :defaultActive="defaultMenuItem">
                <el-menu-item index="/index">首页</el-menu-item>
                <el-menu-item index="/wiki">文档资源</el-menu-item>
                <el-menu-item index="/console" v-if="auth4Page('/console')">管理控制台</el-menu-item>
                <el-menu-item index="/demo" v-if="auth4Page('/demo')">Demo展示</el-menu-item>
            </el-menu>
            <div class="app-box pull-right">
                <div class="app-info">
                    <div class="app-label">实时应用数</div>
                    <div class="counter-box">
                        <span class="counter">0</span>
                        <span class="counter">0</span>
                        <span class="counter">0</span>
                        <span class="counter">0</span>
                    </div>
                </div>
                <el-dropdown class="app-avator" size="small" :show-timeout="150" v-if="isLogin">
                    <span class="el-dropdown-link">
                        <i class="icon-user"></i>
                        <span class="ecllipse" :title="username">{{username}}</span>
                        <i class="icon-arrow-down"></i>
                        </span>
                    <el-dropdown-menu class="m-dropdown text-center" slot="dropdown">
                        <el-dropdown-item>
                            <router-link class="link" to="/console">管理控制台</router-link>
                        </el-dropdown-item>
                        <el-dropdown-item divided>
                            <router-link class="link" to="/index/user">账号设置</router-link>
                        </el-dropdown-item>
                        <el-dropdown-item>
                            <router-link class="link" to="/index/pwd">修改密码</router-link>
                        </el-dropdown-item>
                        <el-dropdown-item divided>
                            <router-link class="link" to="/logout">退出</router-link>
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <div class="app-avator" v-else>
                    <a href="login" class="link link-btn" title="登录管理控制台">登录</a>
                </div>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    export default {
        props: {
            defaultMenuItem: {type:String, default:'/index'}, // 要选中的菜单项
        },
        created(){
            let user = IOT.loadUserInfoLocalStorage();
            if(user){
                this.username = user.userName||user.loginName;
                this.isLogin = true;
            }
        },
        data () {
            return {
                logoName: '轻应用平台',
                username: null,
                isLogin: false,
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
    @import "../../assets/less/mixin.less";
    .header-bar {
        color: #FFF;
        .link-btn {
            color: #fff;
            font-size: 12px;
            border: 1px solid #fff;
            padding: 7px 14px 6px 14px;
            border-radius: 6px;
            transition: all 0.2s linear;
            &:hover {
                color: #FFF;
                background-color: lighten(@primaryColor, 10%);
                box-shadow: 0 0 5px #FFF;
            }
        }
        .logo {
            .flexlayout(inline-flex, row, center, space-between);
            position: relative;
            height: 100%;
            width: 305px;
            margin-right: 60px;
            font-size: 24px;
            color: #FFF;
            .splitter {
                display: inline-block;
                margin: 0 10px;
                height: 25px;
                width: 1px;
                background: #FFF;
            }
        }
        .el-menu.el-menu--horizontal {
            width: 315px;
            display: inline-block;
            position: relative;
            height: 100%;
            box-sizing: border-box;
            background-color: @primaryColor;
            border-bottom: none !important;
            .el-menu-item {
                height: 100%;
                line-height: 70px;
                color: #FFF;
                border-bottom: none !important;
                margin-right: 5px;
                font-size: 16px;
            }
            > .el-menu-item {
                &.is-active,
                &:hover {
                    background-color: lighten(@primaryColor, 12%);
                }
            }
        }
        .app-box {
            position: relative;
            right: 0;
            top: 0;
            height: 100%;
            min-width: 350px;
            line-height: 70px;
            .app-info {
                display: inline-block;
                font-size: 14px;
                .app-label {
                    position: relative;
                    display:inline-block;
                    margin-right: 15px;
                    &:after {
                        content: ':';
                        position: absolute;
                        right: -10px;
                    }
                }
                .counter-box {
                    display: inline-block;
                    .counter {
                        border-radius: 2px;
                        background-color: #FFF;
                        padding: 8px 6px;
                        margin-left: 5px;
                        color: @primaryFontColor;
                    }
                }
            }
            .app-avator {
                color: #FFF;
                max-width: 180px;
                margin-right: 10px;
                right: 0;
                top: 0;
                text-align: right;
                float: right;
                .el-dropdown-link.el-dropdown-selfdefine {
                    .flexlayout(inline-flex, row, center, space-between);
                    .icon-arrow-down {
                        transition: transform 0.35s linear;
                    }
                    &:hover {
                        .icon-arrow-down {
                            transform: rotateX(180deg);
                        }
                     }
                }
                .icon-user {
                    font-size: 20px;
                    vertical-align: middle;
                }
                .ecllipse {
                    display: inline-block;
                    max-width: 120px;
                    text-overflow: ellipsis;
                    overflow: hidden;
                }
            }
        }
    }

</style>
