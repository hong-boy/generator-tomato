<template>
    <el-row class="header-bar" justify="center" align="middle">
        <div class="container">{{desc}}</div>
    </el-row>
</template>

<script type="text/ecmascript-6">
    export default {
        data() {
            return {desc: 'header bar...'};
        }
    }
</script>

<style lang="less">
    .header-bar{
        color:#fff;
        line-height:70px;
    }
</style>
