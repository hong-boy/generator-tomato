'use strict';
import demo_child from './demo_child.vue'
import { mavonEditor } from 'mavon-editor'
export default {
    data(){
        return {
            demoMarkdown: '\n ![img.png](./0)',
            vloading2: false,
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
            toolbarsFlag:false
        };
    },
    // mounted() {
    //     // 如果原始md字符串中存在曾上传的图片， 则需要将对应<img>中的src替换为base64
    //     this.$nextTick(() => {
    //         $vm.$imgUpdateByUrl('./0', '');
    //     }
    // },
    components: {
        // 注册局部组件
        demoChild: demo_child,
        //编辑器
        mavonEditor:mavonEditor
    },
    methods: {
        parseEvent(event){
            console.log('parseEvent: ', event.target, arguments);
            var clipboardData = event.clipboardData, item,items;
            if( clipboardData ){
                items = clipboardData.items;
                if( !items ){
                    return;
                }
                item = items[0];
                if( item && item.kind === 'file' && item.type.match(/^image\//i) ){
                    var blob = item.getAsFile(),
                        reader = new FileReader();
                    reader.onload = function( e ){
                        var img = new Image();
                        img.src = e.target.result;
                        event.target.value = e.target.result;
                        console.log(e.target.result);
                    };
                    reader.readAsDataURL( blob );
                }
            }
        },
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
        },
        openLoading2(){
            this.vloading2 = true;
            setTimeout(() => {
                this.vloading2 = false;
            }, 5000);
        },
        search4Table(){
            IOT.fetch('/app/list/getData', {}, {target: '.demo-page table.el-table__body'});
        },
        // $imgAdd(pos, $file){
        //     // 将图片上传到服务器.
        //     var formdata = new FormData();
        //     formdata.append('image', $file);
        //     axios({
        //         url: 'server url',
        //         method: 'post',
        //         data: formdata,
        //         headers: { 'Content-Type': 'multipart/form-data' },
        //     }).then((flag) => {
        //     })
        // }
    }
}
