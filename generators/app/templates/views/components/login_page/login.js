'use strict';

export default {
    created() {
        IOT.signout();
    },
    data() {
        return {
            desc4btn: '登录',
            url4captcha: 'common/captcha',
            form: {
                username: '',
                password: '',
                captcha: ''
            },
            rules: {
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' }
                ],
                captcha: [
                    { required: true, message: '请输入验证码', trigger: 'blur' }
                ]
            },
            loading: false
        };
    },
    methods: {
        submitForm(form) {
            let thiz = this;
            thiz.$refs[form].validate(async function(valid) {
                if (valid) {
                    let param = {
                        username: thiz.form.username,
                        password: thiz.form.password,
                        captcha: thiz.form.captcha
                    };
                    thiz.loading = true;
                    thiz.desc4btn = '登录中';
                    let result = await IOT.fetch('/login', param);
                    if (result.status === 200) {
                        IOT.showMessage('登录成功', 'success', 1000, async function() {
                            IOT.removeUserInfoLocalStorage();
                            IOT.restoreUserInfoLocalStorage(result.data);
                            IOT.redirect2Home(thiz.$router);
                            thiz.loading = false;
                            thiz.desc4btn = '登录';
                        });
                    } else {
                        thiz.reloadCaptcha();
                        IOT.showMessage(result.msg||'登录失败', 'error', 1000);
                        thiz.loading = false;
                        thiz.desc4btn = '登录';
                    }
                }
                return false;
            });
            return false;
        },
        reloadCaptcha(e) {
            this.form.captcha = '';
            let img = e.target;
            img.src = `${this.url4captcha}?_=${Date.now()}`;
        }
    }
}
