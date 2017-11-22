'use strict';
import demo_child from './demo_child.vue'

export default {
    data(){
        return {
            form: {
                accountName: '',
                accountPwd: '',
                status: '1',
                cata: ['food'],
                delivery: true,
                desc: '',
                region: '',
                date1: '',
                date2: '',
            },
            pickerOptions2: {
                shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近一个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近三个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                        picker.$emit('pick', [start, end]);
                    }
                }]
            },
            table: {
                search: {
                    appNameCn: '',
                    status: '-1'
                },
                page: {
                    pageNum: 1,
                    pageSize: 5,
                    total: 700
                },
                list: [{
                    date: '2016-05-03',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                }, {
                    date: '2016-05-02',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                }, {
                    date: '2016-05-04',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                }, {
                    date: '2016-05-01',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                }, {
                    date: '2016-05-08',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                }, {
                    date: '2016-05-06',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                }, {
                    date: '2016-05-07',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                }],
            },
            dialog: {
                visible: false,
            },
            dialog4compt: {
                visible: false,
            },
            currCompt: 'demoChild', // 当前组件
            loading4btn: false,
        };
    },
    components: {
        // 注册局部组件
        demoChild: demo_child
    },
    methods: {
        openDialog4Confirm(){
            this.dialog.visible = true;
        },
        closeDialog4Confirm(){
            this.dialog.visible = false;
        },
        openDialog4Compt(){
            this.dialog4compt.visible = true;
        },
        closeDialog4Compt(){
            this.dialog4compt.visible = false;
        },
        handleDialogOpen(){
            this.currCompt = 'demoChild';
        },
        handleDialogClose(){
            this.currCompt = null;
        },
        showBtnLoading(){
            this.loading4btn = true;
            setTimeout(function () {
                this.loading4btn = false;
            }.bind(this), 3000);
        },
        openMessage(type = 'info'){
            this.$message({
                type: type,
                message: '消息提示',
                duration: 0,
                // duration: 3000,
                showClose: true,
            });
        },
        openLoading(){
            let inst = this.$loading({
                target: '#sec_panel',
                text: '加载中',
                spinner: 'el-icon-loading'
            });
            setTimeout(function () {
                inst.close();
            }, 3000)
        }
    }
}
