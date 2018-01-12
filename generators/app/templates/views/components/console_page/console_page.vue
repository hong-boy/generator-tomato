<template>
    <div class="console-page">
        <header-bar ref="headerbar"></header-bar>
        <transition name="slide">
            <router-view class="page el-row"></router-view>
        </transition>
        <footer-bar></footer-bar>
    </div>
</template>

<script type="text/ecmascript-6">
    import HeaderBar from '../common/header_bar'
    import FooterBar from '../common/footer_bar'

    export default {
        components: {
            'header-bar': HeaderBar,
            'footer-bar': FooterBar
        }
    }
</script>

<style lang="less">
    @import "../../assets/less/mixin.less";
    .console-page {
        min-height: 100vh;
        .flexlayout(flex, row, center, space-between);
    }
</style>
