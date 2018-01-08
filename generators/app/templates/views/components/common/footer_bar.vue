<template>
    <el-row class="footer-bar">
        <div class="container">
            <a href="http://iot.10086.cn/">中移物联网</a>
            <span> 版权所有 ©{{year}}</span>
        </div>
    </el-row>
</template>

<script type="text/ecmascript-6">
    export default {
        data () {
            return {
                year: new Date().getFullYear()
            };
        }
    }
</script>

<style lang="less">
    .footer-bar .container {
      font-size: 12px;
      a {
        color: inherit;
      }
    }
</style>
