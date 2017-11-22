<template>
    <div class="demo-page">
        <section class="section">
            <h2>表单</h2>
            <div class="sec-panel">
                <el-form class="form" v-model="form" label-width="80px">
                    <el-form-item label="账号名称">
                        <el-input placeholder="请输入账号" v-model="form.accountName"></el-input>
                    </el-form-item>
                    <el-form-item label="密码">
                        <el-input type="password" v-model="form.accountPwd" placeholder="请输入密码"></el-input>
                    </el-form-item>
                    <el-form-item label="活动区域">
                        <el-select v-model="form.region" placeholder="请选择活动区域">
                            <el-option label="区域一" value="shanghai"></el-option>
                            <el-option label="区域二" value="beijing"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="活动时间">
                        <!-- 必须配置size=small -->
                        <el-date-picker
                            size="small"
                            v-model="form.date1"
                            type="datetimerange"
                            :editable="false"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            align="right">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="启用状态">
                        <el-radio-group v-model="form.status">
                            <el-radio label="启用" value="1"></el-radio>
                            <el-radio label="禁用" value="0"></el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="类别">
                        <el-checkbox-group v-model="form.cata">
                            <el-checkbox value="food" label="美食/餐厅线上活动" name="cata"></el-checkbox>
                            <el-checkbox value="activity" label="地推活动" name="cata"></el-checkbox>
                            <el-checkbox value="offline" label="线下主题活动" name="cata"></el-checkbox>
                            <el-checkbox value="exposion" label="单纯品牌曝光" name="cata"></el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item label="即时配送">
                        <el-switch name="delivery" :width="35" v-model="form.delivery"></el-switch>
                    </el-form-item>
                    <el-form-item label="描述">
                        <el-input type="textarea" v-model="form.desc" noresize palceholder="请输入描述"></el-input>
                    </el-form-item>
                </el-form>
            </div>
        </section>
        <section class="section">
            <h2>按钮</h2>
            <div class="sec-panel">
                <el-button type="primary">主按钮</el-button>
                <el-button>次按钮</el-button>
                <el-button round plain>圆角按钮</el-button>
                <el-button class="icon-btn" title="图标按钮">
                    <i class="icon-search"></i>
                </el-button>
                <el-button type="primary" disabled>主按钮</el-button>
                <el-button disabled>次按钮</el-button>
                <el-button round plain disabled>圆角按钮</el-button>
                <el-button disabled class="icon-btn" title="图标按钮">
                    <i class="icon-search"></i>
                </el-button>
                <el-button type="primary" :loading="loading4btn" @click="showBtnLoading">
                    带加载效果按钮
                </el-button>
            </div>
        </section>
        <section class="section">
            <h2>表格</h2>
            <div class="sec-panel">
                <!-- 内联搜索 -->
                <el-form class="form" :inline="true">
                    <el-form-item>
                        <el-select v-model="table.search.status" placeholder="应用状态">
                            <el-option label="全部" value="-1"></el-option>
                            <el-option label="已启用" value="1"></el-option>
                            <el-option label="待审核" value="2"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-input :model="table.search.appNameCn" placeholder="请输入应用名称"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button class="icon-btn">
                            <i class="icon-search"></i>
                        </el-button>
                    </el-form-item>
                    <el-form-item class="pull-right">
                        <el-button>批量设置调用次数</el-button>
                    </el-form-item>
                </el-form>
                <!-- 表格 -->
                <el-table
                    class="tbl"
                    stripe
                    :data="table.list"
                    tooltip-effect="dark"
                    style="width: 100%">
                    <el-table-column
                        type="selection"
                        width="55">
                    </el-table-column>
                    <el-table-column
                        label="日期"
                        width="120">
                        <template slot-scope="scope">{{ scope.row.date }}</template>
                    </el-table-column>
                    <el-table-column
                        prop="name"
                        label="姓名"
                        width="120">
                    </el-table-column>
                    <el-table-column
                        prop="address"
                        label="地址"
                        show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                        label="操作">
                        <template slot-scope="scope">
                            <el-tooltip content="添加" placement="top">
                                <span class="link">添加</span>
                            </el-tooltip>
                            |
                            <el-tooltip content="编辑" placement="top">
                                <span class="link underline">编辑</span>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- 分页 -->
                <el-pagination
                    class="pgn"
                    layout="prev, pager, next, slot"
                    :current-page="table.page.pageNum"
                    :page-size="table.page.pageSize"
                    :total="table.page.total">
                    <span class="slot">
                        <span>共 {{table.page.total}} 页</span>
                        <span class="spliter">/</span>
                        <span>{{table.page.total}} 条数据</span>
                    </span>
                </el-pagination>
            </div>
        </section>
        <section class="section">
            <h2>对话框</h2>
            <div class="sec-panel">
                <el-button type="primary" @click="openDialog4Confirm">确认框</el-button>
                <el-button type="primary" @click="openDialog4Compt">
                    在对话框中加载其他组件
                </el-button>
            </div>
            <!-- 确认框 -->
            <el-dialog class="dialog confirm"
                       :visible.sync="dialog.visible"
                       :close-on-click-modal="false"
                       :close-on-press-escape="true">
                <div slot="title">温馨提示</div>
                <div>我是内容区域 :)</div>
                <div slot="footer">
                    <el-button type="primary" @click="closeDialog4Confirm">确定</el-button>
                    <el-button @click="closeDialog4Confirm">取消</el-button>
                </div>
            </el-dialog>
            <!-- 在对话框中加载其他组件 -->
            <el-dialog class="dialog"
                       :visible.sync="dialog4compt.visible"
                       width="500px"
                       :close-on-click-modal="false"
                       :close-on-press-escape="true"
                       @open="handleDialogOpen"
                       @close="handleDialogClose">
                <div slot="title">对话框</div>
                <component :is="currCompt" :dialogVisible.sync="dialog4compt.visible"></component>
            </el-dialog>
        </section>
        <section class="section">
            <h2>消息提示</h2>
            <div class="sec-panel">
                <el-button type="primary" @click="openMessage('success')">
                    成功-消息提示
                </el-button>
                <el-button type="primary" @click="openMessage('error')">
                    失败-消息提示
                </el-button>
                <el-button type="primary" @click="openMessage('warning')">
                    警告-消息提示
                </el-button>
                <el-button type="primary" @click="openMessage('info')">
                    普通-消息提示
                </el-button>
            </div>
        </section>
        <section class="section" id="sec_panel">
            <h2>Loading</h2>
            <div class="sec-panel">
                <el-button type="primary" @click="openLoading">
                    全局Loading
                </el-button>
            </div>
        </section>
        <section class="section">
            <h2>Tag</h2>
            <div class="sec-panel">
                <el-tag>标签一</el-tag>
                <el-tag type="success">标签二</el-tag>
                <el-tag type="info">标签三</el-tag>
                <el-tag type="warning">标签四</el-tag>
                <el-tag type="danger">标签五</el-tag>
                <br/>
                <br/>
                <el-tag class="solid">标签一</el-tag>
                <el-tag type="success" solid>标签二</el-tag>
                <el-tag type="info" solid>标签三</el-tag>
                <el-tag type="warning" solid>标签四</el-tag>
                <el-tag type="danger" solid>标签五</el-tag>
                <br/>
                <br/>
                <el-tag class="solid" closable>标签一</el-tag>
                <el-tag type="success" solid closable>标签二</el-tag>
                <el-tag type="info" solid closable>标签三</el-tag>
                <el-tag type="warning" solid closable>标签四</el-tag>
                <el-tag type="danger" solid closable>标签五</el-tag>
                <br/>
                <br/>
                <el-tag class="solid" size="small">small 标签一</el-tag>
                <el-tag type="success" solid size="small">small 标签二</el-tag>
                <el-tag type="info" solid size="small">small 标签三</el-tag>
                <el-tag type="warning" solid size="small">small 标签四</el-tag>
                <el-tag type="danger" solid closable size="small">small 标签五</el-tag>
            </div>
        </section>
    </div>
</template>

<script type="text/ecmascript-6" src="./demo_page.js"></script>

<style lang="less">
    @import "../../assets/less/mixin.less";
    .demo-page{
    .section{
        box-shadow:0px 0px 16px #aaa;
        margin:10px auto;
        width:80%;
        padding:10px;
        box-sizing:border-box;
        background:#fff;
    }
    .sec-panel{
    }
    }
</style>
