<template>
  <!-- 按钮相关部分: 内置按钮事件 -->
  <el-form-item
    class="zh-table-inline-button"
    label-width="0px"
    v-if="formSettings?.hasSearchButton"
  >
    <el-button type="primary" :icon="Search" @click="() => table.throttleInitData()"
      >查询</el-button
    >
  </el-form-item>
  <el-form-item
    class="zh-table-inline-button"
    label-width="0px"
    v-if="formSettings?.hasResetButton"
  >
    <el-button
      type="info"
      :icon="RefreshLeft"
      @click="
        () => {
          form.refZHForm.value && form.refZHForm.value.init();
        }
      "
      >重置</el-button
    >
  </el-form-item>
  <el-form-item class="zh-table-inline-button" label-width="0px" v-if="formSettings?.hasAddButton">
    <el-button type="success" :icon="Plus" @click="() => modalInstance.openAddModal()"
      >新增</el-button
    >
  </el-form-item>
  <el-form-item
    class="zh-table-inline-button"
    label-width="0px"
    v-if="formSettings?.hasUploadButton"
  >
    <el-upload
      v-model:file-list="form.fileList.value"
      class="upload-demo"
      action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
      multiple
      :on-preview="form.handlePreview"
      :on-remove="form.handleRemove"
      :limit="3"
      :on-exceed="form.handleExceed"
    >
      <el-button type="warning" :icon="Upload">导入</el-button>
    </el-upload>
  </el-form-item>
  <el-form-item
    class="zh-table-inline-button"
    label-width="0px"
    v-if="formSettings?.hasExportButton"
  >
    <el-button type="warning" :icon="Download">导出</el-button>
  </el-form-item>
  <el-form-item
    class="zh-table-inline-button"
    label-width="0px"
    v-if="formSettings?.hasDeleteButton"
  >
    <el-button type="danger" :icon="Delete" @click="table.batchDelete">批量删除</el-button>
  </el-form-item>
  <el-form-item
    class="zh-table-inline-button"
    label-width="0px"
    v-for="(item, index) in formSettings?.buttons"
    :key="index"
  >
    <el-button :icon="item.icon" @click="item.method" :style="item.style">{{
      item.label
    }}</el-button>
  </el-form-item>
</template>

<script lang="ts" setup>
  import { PropType, toRefs } from 'vue';
  import { RefreshLeft, Search, Delete, Download, Plus, Upload } from '@element-plus/icons-vue';
  import Table from './table';
  import Modal from './modal';
  import Form from './form';

  const props = defineProps({
    formSettings: {
      type: Object as PropType<any>,
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

  const { table, formSettings, modalInstance, form } = toRefs(props);
</script>

<style lang="scss" scoped>
  .zh-table-inline-button {
    &:deep(.el-upload-list.el-upload-list--text) {
      display: none;
    }
  }
</style>
