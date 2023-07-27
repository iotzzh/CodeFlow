<template>

  <div class="zh-virtual-scroll-table">
    <ZHForm ref="refZHForm" class="zh-form" v-if="formSettings" v-model="form.formModel"
      v-model:converted-model="form.convertedFormModel" :form-settings="formSettings">
      <!-- 传递form默认插槽 -->
      <template #default>
        <slot name="zh-table-form-default-before"></slot>
        <ZHFormButtons :form="form" :table="table" :formSettings="formSettings" :modalInstance="modalInstance">
        </ZHFormButtons>
        <slot name="zh-table-form-default-after"></slot>
      </template>

      <!-- 传递form带字段名的插槽 -->
      <template v-for="item in sloTFromFields" v-slot:[form._convertSlotName(item.prop)]>
        <slot :name="'zh-table-form-' + item.prop"></slot>
      </template>

      <!-- 传递form下一行的插槽 -->
      <template v-slot:zh-form-next-row>
        <slot name="zh-table-form-next-row"></slot>
      </template>
    </ZHForm>

    <!-- table部分：配置文件对象 tableSettings  -->
    <div style="flex:1; height: 100%; overflow: hidden;">
      <vxe-table ref="refTable" class="zh-vxe-table" align="center" :data="table.data.value" size="small"
        :auto-resize="true" :row-config="{ keyField: 'id', isCurrent: true, isHover: true }"
        :height="tableSettings.height || '100%'" :highlight-current-row="tableSettings.highlightCurrentRow"
        v-loading="table.loading.value" @row-click="table.rowClick" @scroll="table._handleScrollEvent">

        <vxe-column width="40" v-if="tableSettings.hasSelection">
          <template #default="{ row }">
            <el-checkbox v-model="row.isDefaultChecked"></el-checkbox>
          </template>
        </vxe-column>
        <vxe-column type="seq" width="60"></vxe-column>
        <!-- <vxe-column v-if="tableSettings.hasIndex" type="seq" title="序号" width="60" align="center"></vxe-column> -->


        <vxe-column v-for="(item, index) in table.columns.value" :key="index" :width="item.width ? item.width : ''"
          :min-width="item.minWidth ? item.minWidth : ''" :label="item.label" :prop="item.prop"
          :sortable="item.sortable" :class-name="item.className" :field="item.prop" :title="item.label">
          <template #default="scope">
            <span class="cell-content-box" @mouseover="(e: any) => {
              if (item.allowCellEdit) table.cellContentOver(scope);
            }" @mouseleave="(e: any) => table.cellContentLeave(scope)">

              <span class="cell-content" v-if="!table.cellCanShowSaveCancel(scope)">
                <span v-if="item.convert">{{
                    item.convert(scope.row, scope.$index)
                }}</span>

                <span v-else-if="item.format">{{
                    scope.row[item.prop as string] &&
                    dayjs(scope.row[item.prop as string]).format(item.format)
                }}</span>

                <!-- 自定义内容 -->
                <template v-else-if="item.useSlot">
                  <slot :name="'table-' + item.prop" :row="scope.row" :index="scope.$index" :label="item.label" />
                </template>

                <span v-else>
                  {{
                      scope.row[item.prop as string] === undefined ||
                        scope.row[item.prop as string] === null
                        ? item.nullValue
                        : scope.row[item.prop as string]
                  }}
                </span>
              </span>

              <span v-else class="cell-content-edit" style="display: inline-block; width: calc(100% - 36px)">
                <!-- 输入框 -->
                <el-input v-if="item.addEditInfo?.type === 'input'"
                  v-model="scope.row[table._convertPropToEditingProp(item.prop as string)]"
                  :type="item.addEditInfo?.inputType" :clearable="item.addEditInfo?.clearable"></el-input>

                <!-- 下拉 -->
                <el-select v-else-if="item.addEditInfo?.type === 'select'"
                  v-model="scope.row[table._convertPropToEditingProp(item.prop as string)]"
                  :style="{ width: item.addEditInfo?.width ? `${item.addEditInfo?.width}` : '100%' }"
                  :value-key="item.addEditInfo?.valueKey" :disabled="item.addEditInfo?.disabled"
                  :multiple="item.addEditInfo?.multiple" filterable clearable :remote="item.addEditInfo?.remote"
                  :remote-method="item.addEditInfo?.remoteMethod" :placeholder="
                    item.addEditInfo?.placeholder
                      ? item.addEditInfo?.placeholder
                      : item.addEditInfo?.remoteMethod
                        ? '请输入选择'
                        : '请选择'
                  ">
                  <el-option
                    v-for="(subItem, subIndex) in (item.addEditInfo?.options as Array<TZHFromFieldSelectOption> | Array<{ [x: string]: any }>)"
                    :key="item.addEditInfo?.valueKey ? subItem[item.addEditInfo?.valueKey] : subIndex"
                    :label="subItem.label" :value="item.addEditInfo?.valueKey ? subItem : subItem.value"></el-option>
                </el-select>
              </span>

              <span>
                <el-button v-show="table.cellCanShowEdit(scope)" link type="primary" size="small" :icon="Edit"
                  @click="() => table.clickInlineEdit(scope)"></el-button>
                <span v-show="table.cellCanShowSaveCancel(scope)">
                  <el-button link type="success" size="small" :icon="Select" @click="table.clickInlineSave(scope)">
                  </el-button>
                  <el-button link type="danger" size="small" :icon="CloseBold" @click="table.clickInlineCancel(scope)">
                  </el-button>
                </span>
              </span>
            </span>
          </template>
        </vxe-column>

        <vxe-column v-if="tableSettings.actionColumn" :fixed="tableSettings.actionColumn?.fixed"
          :width="tableSettings.actionColumn?.width" :min-width="tableSettings.actionColumn?.minWidth"
          :label="tableSettings.actionColumn?.label" :align="
            tableSettings.actionColumn?.align
              ? tableSettings.actionColumn.align
              : 'center'
          ">
          <template #default="scope">
            <el-button v-if="tableSettings.actionColumn?.hasRowEditAction" link type="primary" size="small" :icon="Edit"
              @click.stop="modalInstance.openEditModal(scope.row)">编辑</el-button>
            <el-button v-if="tableSettings.actionColumn?.hasRowDeleteAction" link type="danger" size="small"
              :icon="Delete" @click.stop="table.rowDelete(scope.row)">删除</el-button>
            <el-button v-for="(item, buttonIndex) in tableSettings.actionColumn.buttons" :key="buttonIndex" link
              v-show="!item?.hide" :type="item?.type" :size="item?.size ? item.size : 'small'" :icon="item?.icon"
              :style="item?.style" @click.stop="item?.onClick && item?.onClick(scope.row, scope.$index)">{{ item.label
              }}
            </el-button>
          </template>
        </vxe-column>

        <!-- <vxe-column v-if="tableSettings.needOperations" :fixed="tableSettings.operationSettings?.fixed"
        :width="tableSettings.operationSettings?.width" :min-width="tableSettings.operationSettings?.minWidth"
        :label="tableSettings.operationSettings?.label"
        :align="tableSettings.operationSettings?.align ? tableSettings.operationSettings.align : 'center'">
        <template #default="{ row }">
          <el-button v-for="(item, buttonIndex) in tableSettings.operations" :key="buttonIndex"
            :type="item.type === 'text' ? '' : item.type" :text="item.type && item.type === 'text'"
            :size="item.size ? item.size : 'small'" :icon="item.icon" :style="item.style"
            @click.stop="item.method && tableInstance.handleTableActionButton(item.method, row)">{{
                item.label
            }}
          </el-button>
        </template>

      </vxe-column> -->

        <template v-slot:empty>
          <slot name="table-empty"></slot>
        </template>
      </vxe-table>
    </div>


    <!-- page部分： 配置文件对象 pageSettings -->
    <el-pagination style="height: 36px;" v-if="usePage" class="zh-table-pagination" :page-sizes="page?.sizes.value"
      :pager-count="page?.pagerCount.value" :layout="page?.layout.value" :total="pageData.total"
      v-model:currentPage="pageData.current" v-model:page-size="pageData.size"
      @current-change="page?.handleCurrentChange" @size-change="page?.handleCurrentChange" />

    <ZhModalForm ref="refZHFormModal" :modal="modalInstance.modal.value" v-model="modalInstance.formModel.value"
      v-model:converted-model="modalInstance.convertedModel.value" :formSettings="modalInstance.formSettings.value"
      @cancel="modalInstance.cancel" @close="modalInstance.close" @submit="modalInstance.submit"></ZhModalForm>
  </div>
</template>

<script setup lang="ts">
import { toRefs, PropType, computed, ref, reactive, Ref, watch, onMounted, nextTick } from 'vue';
import { RefreshLeft, Search, Delete, Download, DocumentChecked, Refresh, Upload, Edit, CloseBold, Select } from '@element-plus/icons-vue';
import dayjs from 'dayjs';
import ZHForm from '../zh-form/index.vue';
import ZhModalForm from '../zh-modal-form/index.vue';
import ZHFormButtons from './form-buttons.vue';
import { ElTable } from 'element-plus';
import { TZHTablePageSetting, TZHTableRequest, TZHTableSetting, TZHTablePage, TZHTableForm } from './type';
import Page from './page';
import Table from './table';
import Form from './form';
import Modal from './modal';
import { TZHFromField, TZHFormSettings, TZHFromFieldSelectOption } from '../zh-form/type';

const props = defineProps({
  useSearchForm: {
    type: Boolean,
    required: false,
  },

  formSettings: {
    type: Object as PropType<TZHTableForm>,
    required: false, // 必传
  },

  tableSettings: {
    type: Object as PropType<TZHTableSetting>,
    required: true, // 必传
  },

  usePage: {
    type: Boolean,
    required: false,
  },

  pageSettings: {
    type: Object as PropType<TZHTablePageSetting>,
    required: false,
  },

  request: {
    type: Object as PropType<TZHTableRequest>,
    required: false,
  },
});

const {
  useSearchForm,
  formSettings,
  tableSettings,
  usePage,
  pageSettings,
  request,
} = toRefs(props);

const refZHForm = ref();

//#region common
// 分页的组件内部数据
const pageData: Ref<TZHTablePage> = ref({
  total: 0,
  current: 1,
  size: 100,
});
//#endregion

//#region search form
const form = new Form(pageData, request, formSettings, refZHForm);
const watchFormModel = computed(() => {
  return JSON.parse(JSON.stringify(form.formModel.value));
});
watch(
  () => watchFormModel.value,
  (newVal: { [x: string]: any }, oldVal: { [x: string]: any }) => {
    if (!form._compareNeedTriggerSearchFieldsIsEqual(newVal, oldVal)) {
      table.debounceInitData();
    }
  }, { immediate: false });

// 自定义插槽
const sloTFromFields = formSettings?.value?.fields?.filter((x: TZHFromField) => x.type === 'slot');
//#endregion

//#region table
const refTable = ref<InstanceType<typeof ElTable>>();
const table = new Table(tableSettings, refTable, request, form, pageData);
onMounted(() => {
  if (request?.value && request.value.list?.url && (request.value.initialData || request.value.initialData === undefined))
    table.debounceInitData();
});
//#endregion

//#region page
let page: undefined | Page;
// console.log('usePage', usePage.value);
if (usePage.value) page = new Page(pageSettings?.value, pageData, table);
//#endregion

//#region add/edit modal
const refZHFormModal = ref();
const modalInstance = new Modal(request, table, refZHFormModal, tableSettings);
//#endregion

defineExpose({
  // 表单
  getSearchFormModel: form.getSearchFormModel,
  getSearchFormParams: form.getSearchFormParams,
  // 表格
  debounceInitData: table.debounceInitData, // 防抖查询
  throttleInitData: table.throttleInitData, // 节流查询
  initData: table.initData, // 正常查询
  getData: table.getData, // 获取当前表格数据
  getDataAsync: table.getDataAsync, // 从接口获取表格数据，且不刷新表格
  getDataWithInitTable: table.getDataWithInitTable, // 获取接口数据，并刷新表格

});
</script>

<script lang="ts">
export default { name: 'ZHVirtualScrollTable' };
</script>

<style lang="scss" scope>
@import './index.scss';
</style>
