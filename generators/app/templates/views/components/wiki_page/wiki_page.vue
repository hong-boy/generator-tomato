<template>
    <div class="wiki-page">
        <header-bar defaultMenuItem="/wiki"></header-bar>
        <div class="flex-grow">
            <p>Wiki 页面</p>
        </div>
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
    .wiki-page {
    }
</style>
