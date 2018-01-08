<template>
    <div class="login-page">
        <el-row class="login-header" justify="center" align="middle">
            <el-col :span="24">
                <el-row>
                    <h2 class="animated slideInDown">轻应用平台（BaaS）</h2>
                </el-row>
                <el-row>
                    <div class="sys-name animated slideInUp">
                        <p class="sys-name-cn">后台管理系统</p>
                        <p class="sys-name-en">background management system</p>
                    </div>
                </el-row>
            </el-col>
        </el-row>
        <el-row class="login-form" type="flex" justify="center" align="middle">
            <el-col :span="5">
                <el-form class="form" ref="form" :model="form" :rules="rules" label-width="100px">
                    <el-form-item prop="username">
                        <div class="username">
                            <el-input v-model="form.username" placeholder="请输入用户名" @keyup.enter.native="submitForm('form')"></el-input>
                            <i class="icon-user-icon"></i>
                        </div>
                    </el-form-item>
                    <el-form-item prop="password">
                        <div class="password">
                            <el-input v-model="form.password" type="password" placeholder="请输入用户密码" @keyup.enter.native="submitForm('form')"></el-input>
                            <i class="icon-lock-icon"></i>
                        </div>
                    </el-form-item>
                    <el-form-item prop="captcha">
                        <div class="captcha">
                            <el-input v-model="form.captcha" placeholder="请输入验证码" :maxlength="4" @keyup.enter.native="submitForm('form')"></el-input>
                            <i class="icon-verify-icon"></i>
                            <div class="svg-captcha-smooth-wrap">
                                <img id="captcha" src="login/captcha" alt="验证码" title="看不清楚？换一张" @click="reloadCaptcha">
                            </div>
                        </div>
                    </el-form-item>
                    <el-form-item>
                        <el-button :loading="loading" @submit="submitForm('form')" @click="submitForm('form')" type="primary">{{desc4btn}}
                        </el-button>
                    </el-form-item>
                </el-form>
                <p>OneNET 中移物联网开放平台</p>
            </el-col>
        </el-row>
    </div>
</template>

<script type="text/ecmascript-6" src="./login.js"></script>

<style lang="less" src="./login.less"></style>
