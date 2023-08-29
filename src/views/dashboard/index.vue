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
                    <el-scrollbar style="height: 100%;">
                        <el-tree default-expand-all :data="data" highlight-current :props="defaultProps"
                            @node-click="handleNodeClick" class="setting-module">
                            <template #default="{ node, data }">
                                <span class="custom-tree-node" v-if="node?.label?.toLowerCase() === 'web'">
                                    <span>{{ node.label }}</span>
                                    <a style="font-size: 12px; color: blue; padding-left: 7px; "
                                        @click.stop="(e: any) => openVSCode(e)">
                                        <svg t="1691481967251" class="icon" viewBox="0 0 1024 1024" version="1.1"
                                            xmlns="http://www.w3.org/2000/svg" p-id="4025"
                                            xmlns:xlink="http://www.w3.org/1999/xlink" width="20" height="20">
                                            <path
                                                d="M746.222933 102.239573l-359.799466 330.820267L185.347413 281.4976 102.2464 329.864533l198.20544 182.132054-198.20544 182.132053 83.101013 48.510293 201.076054-151.558826 359.799466 330.676906 175.527254-85.251413V187.4944z m0 217.57952v384.341334l-255.040853-192.177494z"
                                                fill="#2196F3" p-id="4026"></path>
                                        </svg>
                                    </a>

                                    <a style="font-size: 12px; color: blue; padding-left: 7px; "
                                        @click.stop="(e: any) => startServer(e)">
                                        <svg t="1691543719689" class="icon" viewBox="0 0 1024 1024" version="1.1"
                                            xmlns="http://www.w3.org/2000/svg" p-id="803"
                                            xmlns:xlink="http://www.w3.org/1999/xlink" width="20" height="20">
                                            <path d="M243.0464 113.7664l536.576 397.8752-536.576 398.0288V113.7664z m0 0"
                                                fill="#00A0E9" p-id="804"></path>
                                        </svg>
                                    </a>

                                    <a style="font-size: 12px; color: blue; padding-left: 7px; "
                                        @click.stop="(e: any) => stopServer(e)">
                                        <svg t="1691543727342" class="icon" viewBox="0 0 1024 1024" version="1.1"
                                            xmlns="http://www.w3.org/2000/svg" p-id="962"
                                            xmlns:xlink="http://www.w3.org/1999/xlink" width="20" height="20">
                                            <path d="M640 832V192h128v640h-128zM256 192h128v640H256V192z" fill="#0590DF"
                                                p-id="963"></path>
                                        </svg>
                                    </a>

                                </span>
                                <span v-else>
                                    {{ node.label }}
                                    <span>
                                        <el-icon v-if="node.label === '界面' || data.menuType === 1"
                                            style="cursor: pointer; position: relative; top: 2px;">
                                            <component is="Plus" @click="(e: any) => clickAddPage(e, node, data)">
                                            </component>
                                        </el-icon>
                                        <el-icon v-if="data.menuType === 1 || data.menuType === 2"
                                            style="cursor: pointer; position: relative; top: 2px;">
                                            <component is="Delete" @click="(e: any) => clickDeletePage(e, node, data)">
                                            </component>
                                        </el-icon>
                                    </span>
                                </span>
                            </template>
                        </el-tree>
                    </el-scrollbar>
                </Pane>
                <Pane size="60" style="height: 100%; overflow-y: hidden; " class="center">
                    <API v-if="selectNode && selectNode.label?.toLowerCase() === 'api'" :workspacePath="workspacePath">
                    </API>
                    <Setting v-else-if="selectNode && selectNode.label?.toLowerCase() === '项目配置'"></Setting>
                    <Environment v-else-if="selectNode && selectNode.label?.toLowerCase() === '环境配置'"></Environment>
                    <Preview v-else :src="src"></Preview>
                </Pane>

                <Pane size="20" style="height: 100%; overflow-y: hidden;" class="right">
                    <APIConfig v-if="selectNode && selectNode.label?.toLowerCase() === 'api'"
                        :workspacePath="workspacePath"></APIConfig>
                    
                    <PageConfig v-else-if="selectNode?.menuType && selectNode.menuType === 2" :routeNode="selectNode"></PageConfig>
                    <div v-else>暂未设计</div>
                </Pane>
            </Splitpanes>
        </div>

        <!-- 界面的新增与修改 -->
        <ZHFormModal v-model="pageAddEditModal.model" :modal-config="pageAddEditModal.modalConfig.value"
            :form-config="pageAddEditModal.formConfig.value" @cancel="pageAddEditModal.close"
            @close="pageAddEditModal.close" @submit="pageAddEditModal.submit">
        </ZHFormModal>
    </div>
</template>

<script lang="ts" setup>
import { nextTick, onMounted, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router'
import { ipcRenderer } from "electron";
import { Splitpanes, Pane } from 'splitpanes';
import 'splitpanes/dist/splitpanes.css'
import ZHFormModal from '@/components/zh-form-modal/index.vue';
import API from './api/APIManage.vue';
import Environment from './Environment.vue';
import Setting from './Setting.vue';
import APIConfig from './api/APIConfig.vue';

// 界面管理
import PageAddEditModal from './page/pageAddEditModal';
import Preview from './page/Preview.vue';
import PageConfig from './page/pageConfig/index.vue';

import { isMessageConfirm } from '@/components/zh-message';
import ZHRequest from '@/components/zh-request';
import api from '@/api';

import { useFileStore } from '@/stores/index';


const router = useRouter();
const fileStore = useFileStore();
const workspacePath = ref((router?.currentRoute?.value?.query?.address || '') as string);
fileStore.setWorkspace(router?.currentRoute?.value?.query?.address as string || '');

const setTreeData = async () => {
    const res = ipcRenderer.sendSync('file:getRouter');
    const routes = res?.data?.records ? treeMap(res.data.records) : [];
    await nextTick();
    const treeData = [];
    treeData.push({
        label: 'Web',
        children: [
            { label: 'API', },
            {
                label: '界面', children: routes, isRoot: true,
            },
            {
                label: '配置', children: [
                    { label: '项目配置' },
                    {
                        label: '环境配置',
                    }
                ]
            },
        ],
    });

    data.value = treeData;
};

const pageAddEditModal = new PageAddEditModal(setTreeData, workspacePath.value);

const name = 'dashboard';

const min = () => { ipcRenderer.send('window:min', name); }

const max = () => { ipcRenderer.send('window:max', name); };

const close = () => { ipcRenderer.send('window:close', name); };

interface Tree {
    label: string
    isRoot?: boolean
    menuType?: number
    url: string
    children?: Tree[]
}

const handleNodeClick = (data: Tree) => {
    console.log(data)
    selectNode.value = data;
    if (data.menuType === 2) {
        src.value = 'http://localhost:8000' + data.url;
    }
}

const selectNode = ref();
const data = ref([] as any);
const treeMap = (arr: any) => {
    // 判断是否是数组
    if (!arr || !(arr.length > 0)) { return }
    // 将值存入map并在值里面循环调用
    return arr.map((v: any, i: any) => {
        return {
            ...v,
            label: v.routeName,
            children: v.children ? treeMap(v.children) : []
        }
    })
};

onMounted(async () => {
    setTreeData();
});

const defaultProps = {
    children: 'children',
    label: 'label',
}

const openVSCode = (e: any) => {
    e.preventDefault();
    ipcRenderer.send('cmd:openCode');
};

const startServer = (e: any) => {
    e.preventDefault();
    ipcRenderer.send('cmd:startServer');
};

const stopServer = (e: any) => {
    e.preventDefault();
    ipcRenderer.send('cmd:stopServer');
};

const clickAddPage = (e: any, node: any, data: any) => {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();

    console.log('node:', node);
    console.log('data: ', data);

    pageAddEditModal.modalConfig.value.show = true;
    if (!data.isRoot) {
        pageAddEditModal.modalConfig.value.data = data;
    } else {
        pageAddEditModal.modalConfig.value.data = null;
    }
};

const clickDeletePage = async (e: any, node: any, data: any) => {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();


    const res = await isMessageConfirm('是否确认删除？', '警告');
    if (!res) return;
    const result = await ZHRequest.post({ url: api.deleteRouter, conditions: { address: workspacePath.value, route: data } });
    console.log('resule: ', result);
    setTreeData();
    // console.log('node:', node);
    // console.log('data: ', data);

    // pageAddEditModal.modalConfig.value.show = true;
    // if (!data.isRoot) {
    //     pageAddEditModal.modalConfig.value.data = data;
    // } else {
    //     pageAddEditModal.modalConfig.value.data = null;
    // }
};


const src = ref('http://localhost:8000');

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
}

.custom-tree-node {
    display: flex;
    align-items: center;
}

.el-tree.setting-module.el-tree--highlight-current {
    &:deep(.el-tree-node.is-expanded.is-current.is-focusable>.el-tree-node__content) {
        background-color: #00A0E9 !important;
        color: white;
    }

}</style>