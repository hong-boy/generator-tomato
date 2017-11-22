<template>
    <div class="main-page">
        <div class="container board">
            <div class="head-wrap">
                <el-breadcrumb separator=">">
                    <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
                </el-breadcrumb>
            </div>

            <div class="statistics">
                <div class="title-wrap">
                    <span>数据统计</span>
                </div>

                <el-row :gutter="20">
                    <el-col :span="6">
                        <el-card class="box-card">
                            <p>设备数量</p>
                            <p class="bigger">{{device.count}}</p>
                            <p>
                                <span>今日新增:</span>
                                <span class="light-yello">{{device.increament}}</span>
                                <span class="divider">|</span>
                                <span>在线设备:</span>
                                <span class="light-yello">{{device.online}}</span>
                            </p>
                        </el-card>
                    </el-col>
                    <el-col :span="6">
                        <el-card class="box-card">
                            <p>数据点数</p>
                            <p class="bigger">{{datapoint.count}}</p>
                            <p>
                                <span>今日新增:</span>
                                <span class="light-yello">{{datapoint.increament}}</span>
                            </p>
                        </el-card>
                    </el-col>
                    <el-col :span="6">
                        <el-card class="box-card">
                            <p>总应用数</p>
                            <p class="bigger">{{app.count}}</p>
                            <p>
                                <span>今日新增:</span>
                                <span class="light-yello">{{app.increament}}</span>
                            </p>
                        </el-card>
                    </el-col>
                    <el-col :span="6">
                        <el-card class="box-card">
                            <p>轻应用管理员</p>
                            <p class="bigger">{{lapp.count}}</p>
                            <p>
                                <span>今日新增:</span>
                                <span class="light-yello">{{lapp.increament}}</span>
                            </p>
                        </el-card>
                    </el-col>
                </el-row>
            </div>

            <div class="latest-application">
                <div class="title-wrap">
                    <span>最新应用</span>
                </div>
                <div class="content"
                     v-loading="vloadingBody"
                     element-loading-text="拼命加载中"
                     element-loading-spinner="el-icon-loading">
                    <el-table class="tbl" :data="table.list" :show-header="false" v-if="!vloadingBody && !v4AppNoData"
                              style="width: 100%">
                        <el-table-column class-name="app-name" align="left" label="应用名称" width="300">
                            <template slot-scope="scope">
                                <router-link class="link" :to="'/app/list/survey/'+scope.row.appId">
                                    {{scope.row.appNameCn}}
                                </router-link>
                            </template>
                        </el-table-column>
                        <el-table-column class-name="app-status" label="应用状态" align="center" width="150">
                            <template slot-scope="scope">
                                <el-tag class="tag" solid size="small" :type="scope.row.status == 3 ? 'success':
                                scope.row.status == 7 ? 'warning': 'info'">
                                    {{scope.row.statusText}}
                                </el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column class-name="app-token" prop="appToken" align="center" label="AccessToken">
                        </el-table-column>
                        <el-table-column class-name="app-cuser" prop="userName" label="创建者" width="200">
                        </el-table-column>
                        <el-table-column prop="uDate" label="更新时间" align="center" width="250">
                        </el-table-column>
                    </el-table>
                    <div id="loadmore" v-if="!vloadingBody && !v4AppNoData" class="load-more">
                        <span v-if="!vloading">
                            {{text}} {{table.list.length}} 个应用，
                            <em class="link" @click="loadmore">点击查看更多</em>
                        </span>
                        <div class="loading pluse" v-if="vloading">
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                    </div>
                    <div v-if="!vloadingBody && v4AppNoData" class="no-data">
                        <span>没有查询到数据:(</span>
                        <span class="link" @click="retry4AppList">重试</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6" src="./main_page.js"></script>

<style lang="less" src="./main_page.less"></style>
