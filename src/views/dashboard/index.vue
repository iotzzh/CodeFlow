<template>
    <div class="box">
        <div class="title">
            <div class="menus">
                <div class="menu">文件</div>
                <div class="menu">编辑</div>
                <div class="menu">启动</div>
                <div class="menu">帮助</div>
            </div>
            <div class="window-options">
                <div class="option min" @click="min"><el-icon>
                        <Minus />
                    </el-icon></div>
                <div class="option max" @click="max"><el-icon>
                        <FullScreen />
                    </el-icon></div>
                <div class="option close" @click="close"><el-icon>
                        <Close />
                    </el-icon></div>
            </div>
        </div>
        <div class="dashboard">
            <Splitpanes class="default-theme" style="height: calc(100vh - 32px)">
                <Pane size="20" style="height: 100%; padding: 10px ; " class="left">
                    <!-- <div class="db">数据管理</div>
                <div class="server">服务管理</div> -->
                    <!-- <div class="web">前端管理</div> -->
                    <el-scrollbar style="height: 100%;">
                        <el-tree default-expand-all :data="data" :props="defaultProps" @node-click="handleNodeClick">
                            <template #default="{ node, data }">
                                <span class="custom-tree-node" v-if="node.label.toLowerCase() === 'web'">
                                    <span>{{ node.label }}</span>
                                    <a style="font-size: 12px; color: blue; padding-left: 7px; position: absolute; " @click.stop="(e:any) => openVSCode(e)">
                                        <svg t="1691481967251" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4025" xmlns:xlink="http://www.w3.org/1999/xlink" width="20" height="20"><path d="M746.222933 102.239573l-359.799466 330.820267L185.347413 281.4976 102.2464 329.864533l198.20544 182.132054-198.20544 182.132053 83.101013 48.510293 201.076054-151.558826 359.799466 330.676906 175.527254-85.251413V187.4944z m0 217.57952v384.341334l-255.040853-192.177494z" fill="#2196F3" p-id="4026"></path></svg>
                                    </a>
                                </span>
                                <span v-else>{{ node.label }}</span>
                            </template>
                        </el-tree>
                    </el-scrollbar>
                </Pane>
                <Pane size="60" style="height: 100%; overflow-y: hidden; " class="center">
                    <API v-if="selectNode && selectNode.toLowerCase() === 'api'"></API>
                    <Setting v-else-if="selectNode && selectNode.toLowerCase() === '项目配置'"></Setting>
                    <Environment v-else-if="selectNode && selectNode.toLowerCase() === '环境配置'"></Environment>
                    <div v-else>首页</div>
                </Pane>
                <Pane size="20" style="height: 100%; overflow-y: hidden;" class="right">3</Pane>
            </Splitpanes>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { ipcRenderer } from "electron";
import { Splitpanes, Pane } from 'splitpanes';
import 'splitpanes/dist/splitpanes.css'
import API from './APIManage.vue';
import Environment from './Environment.vue';
import Setting from './Setting.vue';



const name = 'dashboard';
const min = () => {
    ipcRenderer.send('window:min', name);
}

const max = () => {
    ipcRenderer.send('window:max', name);
};

const close = () => {
    ipcRenderer.send('window:close', name);
};

interface Tree {
    label: string
    children?: Tree[]
}

const handleNodeClick = (data: Tree) => {
    console.log(data)
    selectNode.value = data.label;
}

const selectNode = ref();
const data: Tree[] = [
    {
        label: 'Web',
        children: [
            { label: 'API', },
            {
                label: '界面', children: [
                    { label: '登录页' },
                    { label: '首页' },
                ]
            },
            // 创建页面时，创建路由
            // { label: '路由配置' },
            // { label: '全局方法' },
            {
                label: '配置', children: [
                    { label: '项目配置' },
                    {
                        label: '环境配置', 
                        // children: [
                        //     { label: '本地环境' },
                        //     { label: '开发环境' },
                        //     { label: '测试环境' },
                        //     { label: '生产环境' },
                        // ]
                    }
                ]
            },
        ],
    },

]

const defaultProps = {
    children: 'children',
    label: 'label',
}

const openVSCode = (e:any) => {
    e.preventDefault();
    ipcRenderer.send('cmd:openCode');
};

</script>

<style lang="scss" scoped>
.box {
    height: 100%;
    widows: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.title {
    height: 32px;
    background-color: rgba(0, 0, 0, 0.8);
    -webkit-app-region: drag;
    display: flex;

    .menus,
    .window-options {
        flex: 1;
        display: flex;
        align-items: center;
        color: white;
        font-size: 14px;
    }

    .menus {
        .menu {
            margin-left: 20px;
            -webkit-app-region: no-drag;
            cursor: pointer;

            &:hover {
                cursor: pointer;
            }
        }
    }

    .window-options {
        justify-content: flex-end;

        .option {
            margin-right: 10px;
            cursor: pointer;
        }
    }

    .option {
        -webkit-app-region: no-drag;
    }
}

.dashboard {
    flex: 1;
    // padding: 0px 10px;
    background-color: #F3F3F4;

    .el-tree {
        background-color: #F3F3F4;
    }
}</style>