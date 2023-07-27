<template>
    <!-- 按钮相关部分: 内置按钮事件 -->
    <el-form-item class="zh-table-inline-button" label-width="0px" v-if="formSettings?.hasSearchButton">
        <el-button type="primary" :icon="Search" @click="() => table.throttleInitData()">查询</el-button>
    </el-form-item>
    <el-form-item class="zh-table-inline-button" label-width="0px" v-if="formSettings?.hasAddButton">
        <el-button type="success" :icon="Plus" @click="modalInstance.openAddModal">新增</el-button>
    </el-form-item>
    <el-form-item class="zh-table-inline-button" label-width="0px" v-if="formSettings?.hasUploadButton">
        <el-button type="warning" :icon="Upload">导入</el-button>
    </el-form-item>
    <el-form-item class="zh-table-inline-button" label-width="0px" v-if="formSettings?.hasExportButton">
        <el-button type="warning" :icon="Download">导出</el-button>
    </el-form-item>
    <el-form-item class="zh-table-inline-button" label-width="0px" v-if="formSettings?.hasResetButton">
        <el-button type="info" :icon="RefreshLeft" @click="() => {
            form.refZHForm.value && form.refZHForm.value.init();
        }">重置</el-button>
    </el-form-item>
    <el-form-item class="zh-table-inline-button" label-width="0px" v-if="formSettings?.hasDeleteButton">
        <el-button type="danger" :icon="Delete" @click="table.batchDelete">批量删除</el-button>
    </el-form-item>
    <el-form-item class="zh-table-inline-button" label-width="0px" v-for="(item, index) in formSettings?.buttons"
        :key="index">
        <el-button :icon="item.icon" @click="item.method" :style="item.style">{{ item.label }}</el-button>
    </el-form-item>
</template>

<script lang="ts" setup>
import { PropType, toRefs } from 'vue';
import { TZHTableForm } from './type';
import { RefreshLeft, Search, Delete, Download, Plus, DocumentChecked, Refresh, Upload, Edit } from '@element-plus/icons-vue';
import Table from './table';
import Modal from './modal';
import Form from './form';

const props = defineProps({
    formSettings: {
        type: Object as PropType<TZHTableForm>,
        required: false, // 必传
    },
    table: {
        type: Object as PropType<Table>,
        required: true, // 必传
    },
    modalInstance: {
        type: Object as PropType<Modal>,
        required: true, // 必传
    },
    form: {
        type: Object as PropType<Form>,
        required: true, // 必传
    },
});

const {
    table,
    formSettings,
    modalInstance,
    form,
} = toRefs(props);
</script>