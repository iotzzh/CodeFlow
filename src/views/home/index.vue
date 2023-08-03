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
            <!-- <div class="parts">
                <div class="part">DATA</div>
                <div class="part">SERVER</div>
                <div class="part" @click="openAppListModal">APP</div>
            </div> -->
            <!-- <el-input class="search-input" placeholder="搜索项目名称" prefix-icon="Search"> -->
            <!-- </el-input> -->

            <el-row class="row workspace">
                <el-col class="col" :span="8">
                    <ZHTree :config="workspaceTree.config.value">
                    </ZHTree>
                </el-col>
                <el-col class="col" :span="16">
                    <el-table :data="[]" style="width: 100%" :highlight-current-row="true" class="project-list-table"
                        height="100%">
                        <el-table-column prop="projectName" label="项目名称" />
                        <el-table-column prop="currentBranch" label="当前分支" />
                        <el-table-column fixed="right" label="操作" width="180" align="center">
                            <template #default="scope">
                                <el-button link type="primary" size="small" @click="openDashboard">进入</el-button>
                                <el-button link type="success" size="small">编辑</el-button>
                                <el-button link type="warning" size="small">部署</el-button>
                                <el-button link type="danger" size="small">移除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
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
        <ZHModal :modal-config="appModalConfig">
            <ZHTable :config="appModalTableConfig"></ZHTable>
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

const workspaceTree = new WorkspaceTree();

const createWorkspaceFormModal = new CreateWorkspaceFormModal();

// const workspaceTree = ref({
//     treeConfig: {
//         hasAdd: false,
//         hasEdit: true,
//         hasDelete: true,
//         hasEmptyAdd: true,
//         hasRootAdd: false,
//         labelDisplayMaxLength: 50,
//         initialData: false,
//         checkStrictly: true,
//         showCheckbox: false,
//         defaultProps: {
//             label: 'label',
//         },
//     },
//     requestConfig: {
//         // urlGet: api.getOrgList,
//         // urlAdd: api.addOrg,
//         // urlEdit: api.updateOrg,
//         // urlDelete: api.deleteOrg,
//     },
//     formModalConfig: {
//         modalConfig: {
//             show: false,
//             width: '300px',
//             closeInModal: true,
//             footer: {
//                 hasCancelButton: true,
//                 hasSubmitButton: true,
//             },
//         },
//         formConfig: {
//         //     fields: [
//         //         { prop: 'test', label: '测试', type: 'input', span: 12, },
//         //         { prop: 'test1', label: '测试1', type: 'select', span: 12, convert: 'return 111', defaultOptions: [{ label: '测试1', value: '测试1' }, { label: '测试2', value: '测试2' }] }
//         //     ]
//         },
//         model: {},
//         convertedModel: {},
//     },
// });


const btnCreateSys = async () => {
    createWorkspaceFormModal.modalConfig.value.show = true;
    // createWorkspaceFormModalConfig.value.modalConfig.show = true;
    // ipcRenderer.send('window:min', 'da');
    // const res = ipcRenderer.sendSync('api:workspace:list', 'api');
    // console.log(res);
};

const openDashboard = () => {
    ipcRenderer.send('window:create', {
        name: 'dashboard',
        route: 'dashboard',
    });
};

const appModalConfig = ref({
    show: false,
    title: '应用程序管理',
    width: '100%',
    fullscreen: true,
});

const appModalTableConfig = ref({
    formConfig: {
        hasAddButton: true,
        hasSearchButton: false,
        hasDeleteButton: true,
        hasUploadButton: false,
        hasExportButton: false,
        hasResetButton: false,
        customModel: {},
        formLabelWidth: '70px',
        fields: [
            {
                label: '项目名称', type: 'input', prop: 'phone', maxWidth: '300px'
            },
        ],

    },
    tableConfig: {
        hasIndex: true,
        hasSelection: true,
        rowKey: 'id',
        modal: {
            modalConfig: {
                title: '',
                footer: {},
                onBeforeSubmit: 'console.log("onbeforeSubmit");',
                onAfterSubmit: 'console.log("onaftersubmit");'
            },
            formConfig: {
                formLabelWidth: '90px',
            },
        },
        // onBeforeInitData: `console.log('onBeforeInitData：在初始化数据前执行');`,
        // convertTableData: 'return data;',
        columns: [
            {
                label: '项目名称',
                prop: 'name',
                allowCellEdit: false,
                minWidth: '100px',
                addEditInfo: {
                    type: 'input',
                    addSort: 1,
                    defaultValue: '',
                    placeholder: '请输入',
                    xs: 24,
                    sm: 12,
                    md: 8,
                    lg: 8,
                    xl: 8,
                    required: true,
                }
            },
            {
                label: '地址', prop: 'sex', convert: 'return row?.sex === 0 ? \'男\' : \'女\'',
                minWidth: '80px',
                addEditInfo: {
                    type: 'select', defaultValue: null, addSort: 2, placeholder: '请选择',
                    span: 12,
                    xs: 24,
                    sm: 12,
                    md: 8,
                    lg: 8,
                    xl: 8,
                    options: [{ label: '男', value: 1 }, { label: '女', value: 2 }], required: false,
                }
            },
            {
                label: '账号', prop: 'phone', minWidth: '150px', addEditInfo: {
                    addSort: 2.5,
                    label: '手机号', prop: 'phone',
                    type: 'input', defaultValue: null, placeholder: '请输入', span: 8, xs: 24,
                    sm: 12,
                    md: 8,
                    lg: 8,
                    xl: 8, required: true,
                }
            },

        ],
        actionColumn: {
            label: '操作',
            width: '400px',
            hasRowDeleteAction: true,
            hasRowEditAction: true,
            buttons: [],
        },
    },
    // requestConfig: {
    //     list: { url: api.getUserList, successMessage: '查询成功', errorMessage: '查询失败' },
    //     add: { url: api.addUser, successMessage: '新增成功', errorMessage: '新增失败' },
    //     update: { url: api.updateUser, successMessage: '更新成功', errorMessage: '更新失败' },
    //     delete: { url: api.deleteUser, successMessage: '删除成功', errorMessage: '删除失败' },
    //     batchDelete: { url: api.batchDeleteUser, successMessage: '批量删除成功', errorMessage: '批量删除失败' },
    // },
    // pageConfig: {},
} as TZHTable);

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