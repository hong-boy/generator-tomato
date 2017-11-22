<template>
    <el-form class="form" v-model="form" label-width="80px">
        <el-form-item label="字段一">
            <el-input placeholder="请输入字段一" :model="form.field1"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="submit">提交</el-button>
        </el-form-item>
    </el-form>
</template>

<script type="text/ecmascript-6">
    export default {
        created(){
            console.log('demo_child: created');
        },
        updated(){
            console.log('demo_child: updated');
        },
        destroyed(){
            console.log('demo_child: destroyed');
        },
        props: {
            dialogVisible: {
                type: Boolean,
                default: false,
                required: true
            }
        },
        data(){
            return {
                form: {
                    field1: ''
                }
            };
        },
        methods: {
            submit(){
                console.log('demo_child: submit');
                // 更新父组件的值
                this.$emit('update:dialogVisible', false);
            }
        }
    }
</script>

<style lang="less"></style>
