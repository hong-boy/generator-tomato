<template>
    <el-row class="footer-bar">
        <div class="container">{{desc}}</div>
    </el-row>
</template>

<script type="text/ecmascript-6">
    export default {
        data() {
            return {desc: 'footbar'};
        }
    }
</script>

<style>
    .footer-bar .container{
        font-size:12px;
    }
</style>
