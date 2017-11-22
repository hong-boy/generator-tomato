'use strict';

export default {
    created() {
        IOT.signout();
    },
    data() {
        return {
            desc4btn: '登录',
            form: {
                username: 'adminbs',
                password: 'IOT@2017',
                captcha: ''
            },
            rules: {
                username: [
                    {required: true, message: '请输入用户名', trigger: 'blur'}
                ],
                password: [
                    {required: true, message: '请输入密码', trigger: 'blur'}
                ],
                captcha: [
                    {required: true, message: '请输入验证码', trigger: 'blur'}
                ]
            },
            loading: false
        };
    },
    methods: {
        submitForm(form) {
            let thiz = this;
            thiz.$refs[form].validate(async function (valid) {
                if (valid) {
                    let param = {
                        username: thiz.form.username,
                        // password: md5(thiz.form.password)
                        password: thiz.form.password,
                        captcha: thiz.form.captcha
                    };
                    thiz.loading = true;
                    thiz.desc4btn = '登录中';
                    let result = await IOT.fetch('/login', param);
                    if (result.status === 200) {
                        IOT.showMessage('登录成功', 'success', 1000, async function () {
                            // IOT.removeUserInfo();
                            // IOT.restoreUserInfo(result.data);
                            IOT.removeUserInfoLocalStorage();
                            IOT.restoreUserInfoLocalStorage(result.data);
                            IOT.redirect2Home(thiz.$router);
                            thiz.loading = false;
                            thiz.desc4btn = '登录';
                        });
                    } else {
                        thiz.reloadCaptcha();
                        IOT.showMessage('登录失败', 'error', 1000);
                        thiz.loading = false;
                        thiz.desc4btn = '登录';
                    }
                }
                return false;
            });
            return false;
        },
        reloadCaptcha() {
            this.form.captcha = '';
            let src = 'captcha?time=' + Date.now();
            $('#captcha').attr('src', src);
        },
        async application(){
            this.$router.push('app/check')
        }
    }
}
