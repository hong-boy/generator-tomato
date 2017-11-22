const service = {
    /**
     * 查询数据统计
     * @returns {Promise.<void>}
     */
    async queryStats() {
        let result = await IOT.fetch('/index/stat');
        if (result.status != 200) {
            console.error(result.msg);
        }
        return result.data;
    },
    /**
     * 查询最新应用列表
     * @returns {Promise.<void>}
     */
    async queryAppList(params) {
        let result = await IOT.fetch('/index/list', params);
        return result.data;
    },
    /**
     * 初始化最新应用列表
     * @param vm
     */
    async initAppListUI(vm){
        let appList = await service.queryAppList(vm.table.pager);
        vm.vloadingBody = false;
        if (appList && appList.length) {
            vm.table.list = appList;
            vm.v4AppNoData = false;
        } else {
            vm.v4AppNoData = true;
        }
    },
};

export default {
    async created() {
        let thiz = this;
        // 获取数据统计
        let statInfo = await service.queryStats();
        if (statInfo) {
            thiz.device = statInfo.device;
            thiz.datapoint = statInfo.datapoint;
            thiz.app = statInfo.app;
            thiz.lapp = statInfo.lapp;
        }
        // 获取最新应用列表
        service.initAppListUI(thiz);
    },
    data() {
        return {
            device: { // 设备数量
                count: 0,
                increament: 0,
                online: 0
            },
            datapoint: { // 数据点
                count: 0,
                increament: 0
            },
            app: { // 总应用数
                count: 0,
                increament: 0
            },
            lapp: { // 轻应用管理员
                count: 0,
                increament: 0
            },
            table: {
                pager: {
                    pageSize: 10, // 页长
                    pageNum: 1 // 页号
                },
                list: []
            },
            text: '以上为今日配置的',
            vloading: false,
            vloadingBody: true,
            v4AppNoData: false, // 是否查询到最新应用列表
        };
    },
    computed: {
        visible4App(){
            return !this.vloadingBody;
        }
    },
    methods: {
        async loadmore() {
            let thiz = this;

            thiz.text = '已为您加载';
            thiz.vloading = true;
            thiz.table.pager.pageNum++;
            let appList = await service.queryAppList(thiz.table.pager);
            thiz.vloading = false;
            if (appList.length) {
                appList.map(function (item) {
                    thiz.table.list.push(item);
                });
            } else {
                // 如果appList已无多余数据，将pageNum-1，并将整个p标签更换
                thiz.table.pager.pageNum--;
                $('.main-page #loadmore').html('再怎么加载也没有了哦~');
            }
        },
        /**
         * 重新加载最新应用列表 - no-data
         */
        async retry4AppList(){
            this.vloadingBody = true;
            this.v4AppNoData = false;
            service.initAppListUI(this);
        },
        async application(){
            this.$router.push('app/check')
        }
    }
}
