<template>
    <div class="box">
        <div class="left">
            <div class="title">Code Flow</div>
            <div class="version">Version 0.0.1</div>
            <el-button type="primary" icon="Plus" class="btn-create-project button">创建新项目</el-button>

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
            <div class="top-tips">请先选择一个项目再开始使用</div>
            <el-input class="search-input" placeholder="搜索项目名称" prefix-icon="Search">
            </el-input>

            <el-table :data="tableData" style="width: 100%" :highlight-current-row="true" class="project-list-table"
                height="100%">
                <el-table-column prop="projectName" label="项目名称" />
                <el-table-column prop="currentBranch" label="当前分支" />
                <el-table-column fixed="right" label="操作" width="300" align="center">
                    <template #default="scope">
                        <el-button link type="primary" size="small" @click="openDashboard">进入</el-button>
                        <el-button link type="warning" size="small">部署</el-button>
                        <el-button link type="danger" size="small">移除</el-button>
                        <el-button link type="success" size="small">vscode</el-button>
                    </template>
                </el-table-column>
            </el-table>

        </div>
    </div>
</template>
<script lang="ts" setup>
import { ipcRenderer } from "electron";

const tableData = [
    { projectName: '后台管理系统', currentBranch: 'main(分支管理功能)', },
    { projectName: '后台管理系统', currentBranch: 'main', },
    { projectName: '后台管理系统', currentBranch: 'main', },
    { projectName: '后台管理系统', currentBranch: 'main', },
    { projectName: '后台管理系统', currentBranch: 'main', },
    { projectName: '后台管理系统', currentBranch: 'main', },
    { projectName: '后台管理系统', currentBranch: 'main', },
    { projectName: '后台管理系统', currentBranch: 'main', },
    { projectName: '后台管理系统', currentBranch: 'main', },
    { projectName: '后台管理系统', currentBranch: 'main', },
    { projectName: '后台管理系统', currentBranch: 'main', },
    { projectName: '后台管理系统', currentBranch: 'main', },
    { projectName: '后台管理系统', currentBranch: 'main', },
    { projectName: '后台管理系统', currentBranch: 'main', },
    { projectName: '后台管理系统', currentBranch: 'main', },
    { projectName: '后台管理系统', currentBranch: 'main', },
    { projectName: '后台管理系统', currentBranch: 'main', },
    { projectName: '后台管理系统', currentBranch: 'main', },
    { projectName: '后台管理系统', currentBranch: 'main', },
    { projectName: '后台管理系统', currentBranch: 'main', },
    { projectName: '后台管理系统', currentBranch: 'main', },
    { projectName: '后台管理系统', currentBranch: 'main', },
    { projectName: '后台管理系统', currentBranch: 'main', },
    { projectName: '后台管理系统', currentBranch: 'main', },
    { projectName: '后台管理系统', currentBranch: 'main', },
    { projectName: '后台管理系统', currentBranch: 'main', },
    { projectName: '后台管理系统', currentBranch: 'main', },
]

const openDashboard = () => {
    window.electronAPI.createWindow({
        id: 'dashboard',
        route: 'dashboard',
        fullscreenWithTop: false,
    });
    // window.electronAPI.createWindow(`${location.origin}/dashboard`);
    // ipcRenderer.send('message')
    // window.electronAPI.sendMessage('message');
    // window.open(`${location.origin}/dashboard`);
};

// 监听接收主线程信息
// window.electronAPI.onUpdateCounter((_event:any, value:any) => {
//     console.log(value);
// })
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

        .project-list-table {
            flex: 1;
           &:deep(.el-table__body tr.current-row>td.el-table__cell) {
                background-color: #BFE7FC;
            }
        }
    }
}</style>