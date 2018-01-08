'use strict';

const service={
    /**
     * 未审批应用通知
     * @param vm
     */
    async queryNotice(){
        let result = await IOT.fetch('/index/notice');
        return result.data;
    }
};

export default {
    created() {
        IOT.signout();
    },
    data() {
        return {
            desc4btn: '登录',
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
                        // password: md5(thiz.form.password)
                        password: thiz.form.password,
                        captcha: thiz.form.captcha
                    };
                    thiz.loading = true;
                    thiz.desc4btn = '登录中';
                    let result = await IOT.fetch('/login', param);
                    if (result.status === 200) {
                        IOT.showMessage('登录成功', 'success', 1000,async function() {
                            // IOT.removeUserInfo();
                            // IOT.restoreUserInfo(result.data);
                            IOT.removeUserInfoLocalStorage();
                            IOT.restoreUserInfoLocalStorage(result.data);
                            IOT.redirect2Home(thiz.$router);
                            let noticeInfo = await service.queryNotice();
                            if (noticeInfo) {
                                if(noticeInfo.list.length!==0){
                                    thiz.$notify.info({
                                        title: '消息',
                                        type: 'warning',
                                        duration:6000,
                                        message: "<span style='cursor: pointer'></span>您有 <span class='link'>"+noticeInfo.list.length+"</span>条申请审核未处理<span></span>",
                                        dangerouslyUseHTMLString:true,
                                        offset:50,
                                        onClick:function () {
                                            thiz.$router.push('app/check');
                                            this.close();
                                        }
                                    });

                                }
                            }
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
        reloadCaptcha() {
            this.form.captcha = '';
            let src = 'login/captcha?time=' + Date.now();
            $('#captcha').attr('src', src);
        }
    }
}
