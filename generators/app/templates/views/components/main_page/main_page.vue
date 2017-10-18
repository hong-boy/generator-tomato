<template>
    <div class="main-page">
        <div class="container board">
            <p>Here is main page</p>
            <span @click="getFakeData()">获取数据</span>
            <textarea v-model="list"></textarea>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    export default {
        data(){
            return {
                list: 'Nothing to show...'
            };
        },
        methods: {
            getFakeData: async function () {
                let list = await IOT.fetch('/user/list', {fakeId: 1});
                this.list = list;
            }
        }
    }
</script>

<style lang="less"></style>
