<template>
    <div class="box">
        <div class="left">
            <div class="title">Code Flow</div>
            <div class="version">Version 0.0.1</div>
            <el-button type="primary" icon="Plus" class="btn-create-project button" @click="btnCreateSys">创建工作区</el-button>

            <div class="sub-title">打开</div>
            <el-button type="info" icon="Folder" class="button sub-button">打开本地项目</el-button>
            <el-button type="info" icon="FolderAdd" class="button sub-button">导入项目</el-button>

            <div class="sub-title">Code Flow 版本</div>
            <el-button type="info" icon="Download" class="button sub-button">下载最新版本</el-button>
            <el-button type="info" icon="Tickets" class="button sub-button">选择历史版本</el-button>

            <div class="sub-title">帮助</div>
            <el-button type="info" icon="QuestionFilled" class="button sub-button">Code Flow在线文档</el-button>
        </div>
        <div class="right">
            <div class="welcome">欢迎使用Code Flow</div>
            <div class="top-tips">渐进式低代码系统管理平台, 如何开发随便你~请先创建工作区</div>
            <div class="parts">
                <div class="part">DATA</div>
                <div class="part">SERVER</div>
                <div class="part" @click="openAppListModal">APP</div>
            </div>
            <el-row class="row workspace">
                <el-col class="col" :span="8">
                    <ZHTree :config="workspaceTree.config.value" ref="refWorkspaceTree">
                    </ZHTree>
                </el-col>
                <el-col class="col" :span="16">
                    <ZHTable ref="refProjectTable" :config="dashboardProject.tableConfig.value"></ZHTable>
                </el-col>
            </el-row>
            <!-- <div style="padding: 10px 0px 0px 0px;">
                <el-button>新增工作区间</el-button>
                <el-button>新增项目</el-button>
            </div> -->

        </div>
        <ZHFormModal
            v-model="createWorkspaceFormModal.model"
            :modal-config="createWorkspaceFormModal.modalConfig.value" 
            :form-config="createWorkspaceFormModal.formConfig.value"
            @cancel="createWorkspaceFormModal.close"
            @close="createWorkspaceFormModal.close"
            @submit="createWorkspaceFormModal.submit"
            >
        </ZHFormModal>
        <ZHModal :modal-config="appModalConfig" @close="closeAppModal">
            <ZHTable :config="appProject.tableConfig.value"></ZHTable>
        </ZHModal>
    </div>
</template>
<script lang="ts" setup>
import { ipcRenderer, shell } from "electron";
import ZHModal from '@/components/zh-modal/index.vue';
import ZHTable from '@/components/zh-table/index.vue';
import ZHFormModal from '@/components/zh-form-modal/index.vue';
import ZHTree from '@/components/zh-tree/index.vue';
import { onMounted, ref } from 'vue';
import { TZHTable } from "@/components/zh-table/type";

// 工作区组件
import WorkspaceTree from './workspaceTree';
// 弹窗配置文件
import CreateWorkspaceFormModal from './createWorkspaceFormModal';
import api from "@/api";

// 应用程序管理
import Project from './project';

const refWorkspaceTree = ref();
const refProjectTable = ref();

const dashboardProject  = new Project('dashboard', refProjectTable);
const appProject  = new Project('appManage');

const workspaceTree = new WorkspaceTree(refWorkspaceTree, dashboardProject);

const createWorkspaceFormModal = new CreateWorkspaceFormModal(refWorkspaceTree);




const btnCreateSys = async () => {
    createWorkspaceFormModal.modalConfig.value.show = true;
    // createWorkspaceFormModalConfig.value.modalConfig.show = true;
    // ipcRenderer.send('window:min', 'da');
    // const res = ipcRenderer.sendSync('api:workspace:list', 'api');
    // console.log(res);
};

const appModalConfig = ref({
    show: false,
    title: '应用程序管理',
    width: '100%',
    fullscreen: true,
    // footer: {
    //     hasSubmitButton: true,
    //     hasCancelButton: true,
    // },
});

const closeAppModal = () => {
    refProjectTable.value.initData();
};

const openAppListModal = () => {
    appModalConfig.value.show = true;
};

onMounted(() => {
    ipcRenderer.send('openDialog');
});
</script>
<style lang="scss" scoped>
.box {
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;

    .left {
        height: 100%;
        width: 300px;
        background-color: #F3F3F4;
        padding: 15px;
        text-align: center;

        .title {
            font-size: 18px;
            font-weight: bolder;
        }

        .version {
            font-size: 12px;
            line-height: 30px;
        }

        .button {
            width: 100%;
            justify-content: left;
            margin: 0px;
        }

        .btn-create-project {
            margin-top: 10px;
            margin-bottom: 10px;
        }

        .sub-title {
            text-align: left;
            line-height: 30px;
            height: 30px;
            vertical-align: middle;
            margin-top: 10px;
            color: #515865;
            font-size: 14px;
            padding-left: 5px;
        }

        .sub-button {
            margin-bottom: 7px;
            background-color: #E7E7E9;
            border: none;
            color: #515865;

        }
    }

    .right {
        flex: 1;
        padding: 20px;
        height: 100%;
        background-color: #FFFFFF;
        overflow: hidden;
        display: flex;
        flex-direction: column;

        .welcome {
            font-size: 18px;
            letter-spacing: 0.4em;
            font-style: italic;
        }

        .top-tips {
            font-size: 12px;
            margin: 5px 0px 20px 0px;
        }

        .parts {
            display: flex;
            justify-content: space-around;
            height: 70px;
            margin-bottom: 10px;

            .part {
                flex-basis: 31%;
                height: 100%;
                background-color: #BFE7FC;
                border-radius: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
            }
        }

        .workspace {
            flex: 1;
            overflow: hidden;
        }

        .col {
            height: 100%;
        }

        .project-list-table {
            // flex: 1;

            &:deep(.el-table__body tr.current-row>td.el-table__cell) {
                background-color: #BFE7FC;
            }
        }
    }
}
</style>