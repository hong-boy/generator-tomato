<template>
    <div v-bar class="scrollbar-dynamic wrapper">
        <router-view class="core-view"></router-view>
    </div>
</template>

<script type="text/ecmascript-6">
    export default {}
</script>

<style lang="less">
    .scroll-wrapper.wrapper{
        height:100vh;
    }
</style>
