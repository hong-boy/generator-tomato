<template>
    <div class="home-page">
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
