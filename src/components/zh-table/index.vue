<template>
  <div class="zh-table">
    <ZHForm
      v-if="config.formConfig"
      ref="refZHForm"
      class="zh-form"
      :style="{
        maxHeight: isMobile ? '50%' : '',
      }"
      v-model="form.formModel.value"
      v-model:converted-model="form.convertedFormModel.value"
      :formConfig="config.formConfig"
    >
      <!-- 传递form默认插槽 -->
      <template #default>
        <slot name="zh-table-form-default-before"></slot>
        <ZHFormButtons
          :form="form"
          :table="table"
          :formSettings="config.formConfig"
          :modalInstance="modalInstance"
        >
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

    <!-- table设置行部分：配置文件对象 tableSettingPanel -->
    <div class="zh-table-panel-setting" v-if="config.tablePanelConfig">
      <el-row>
        <el-col :span="12">
          <div class="table-title">
            <el-icon class="icon" v-if="config.tablePanelConfig.title">
              <Grid />
            </el-icon>
            {{ config.tablePanelConfig.title }}
            <span v-if="config.tablePanelConfig.secondaryTitle" style="color: blue">
              ({{ config.tablePanelConfig.secondaryTitle }})
            </span>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- table部分：配置文件对象 tableConfig  -->
    <el-table
      ref="refTable"
      class="zh-el-table"
      :data="table.data.value"
      size="default"
      :height="config.tableConfig.height || '100%'"
      :highlight-current-row="config.tableConfig.highlightCurrentRow"
      v-loading="table.loading.value"
      :row-key="config.tableConfig.rowKey === undefined ? 'id' : config.tableConfig.rowKey"
      @row-click="table.rowClick"
      :tree-props="config.tableConfig.treeProps"
      :lazy="config.tableConfig.lazy"
      :load="table.load"
      :default-expand-all="config.tableConfig.defaultExpandAll"
      :border="config.tableConfig.border === undefined ? true : config.tableConfig.border"
    >
      <el-table-column
        v-if="config.tableConfig.hasSelection"
        type="selection"
        width="50"
        align="center"
        reserve-selection
      >
      </el-table-column>

      <el-table-column
        v-if="config.tableConfig.hasIndex"
        type="index"
        width="60"
        label="序号"
        align="center"
      >
      </el-table-column>

      <el-table-column
        v-for="(item, index) in table.columns.value"
        :key="index"
        :width="item.width ? item.width : ''"
        :min-width="item.minWidth ? item.minWidth : ''"
        :align="item.align ? item.align : 'center'"
        :label="item.label"
        :prop="item.prop"
        :fixed="item.fixed"
        :sortable="item.sortable"
        :class-name="item.className"
      >
        <template #default="scope">
          <span
            class="cell-content-box"
            @mouseover="(e: any) => {
            if (item.allowCellEdit) table.cellContentOver(scope);
          }"
            @mouseleave="(e: any) => table.cellContentLeave(scope)"
          >
            <span class="cell-content" v-if="!table.cellCanShowSaveCancel(scope)">
              <span v-if="item.convert">{{
                table.tableColumnConvert(item.convert, scope.row, scope.$index)
              }}</span>

              <span v-else-if="item.format">{{
                scope.row[item.prop as string] &&
                dayjs(scope.row[item.prop as string]).format(item.format)
              }}</span>

              <!-- 自定义内容 -->
              <template v-else-if="item.slot">
                <!-- 低代码：利用字符串创建新的组件 -->
                <component
                  v-if="typeof item.slot === 'object'"
                  :is="
                    createVueComponent({
                      name: item?.slot?.name || '',
                      template: item.slot.template,
                      props: item.slot.props,
                    })
                  "
                  :row="scope.row"
                  :index="scope.$index"
                  :label="item.label"
                ></component>
                <!-- 当组件使用 -->
                <slot
                  v-else
                  :name="'zh-table-' + item.prop"
                  :row="scope.row"
                  :index="scope.$index"
                  :label="item.label"
                />
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

            <span
              v-else
              class="cell-content-edit"
              style="display: inline-block; width: calc(100% - 36px)"
            >
              <!-- 输入框 -->
              <el-input
                v-if="item.addEditInfo?.type === 'input'"
                v-model="scope.row[table._convertPropToEditingProp(item.prop as string)]"
                :type="item.addEditInfo?.inputType"
                :clearable="item.addEditInfo?.clearable"
              ></el-input>
            </span>

            <span>
              <el-button
                v-show="table.cellCanShowEdit(scope)"
                link
                type="primary"
                size="small"
                :icon="Edit"
                @click="() => table.clickInlineEdit(scope)"
              ></el-button>
              <span v-show="table.cellCanShowSaveCancel(scope)">
                <el-button
                  link
                  type="success"
                  size="small"
                  :icon="Select"
                  @click="table.clickInlineSave(scope)"
                >
                </el-button>
                <el-button
                  link
                  type="danger"
                  size="small"
                  :icon="CloseBold"
                  @click="table.clickInlineCancel(scope)"
                >
                </el-button>
              </span>
            </span>
          </span>
        </template>
      </el-table-column>

      <el-table-column
        v-if="config.tableConfig.actionColumn"
        :fixed="isMobile ? undefined : config.tableConfig.actionColumn?.fixed"
        :width="config.tableConfig.actionColumn?.width"
        :min-width="config.tableConfig.actionColumn?.minWidth"
        :label="config.tableConfig.actionColumn?.label"
        :align="
          config.tableConfig.actionColumn?.align ? config.tableConfig.actionColumn.align : 'center'
        "
      >
        <template #default="scope">
          <el-button
            v-if="config.tableConfig.actionColumn?.hasRowEditAction"
            v-show="
              config.tableConfig.actionColumn?.displayRowEditActionMethod === undefined
                ? true
                : !!config.tableConfig.actionColumn?.displayRowEditActionMethod(scope.row)
            "
            link
            type="primary"
            size="small"
            :icon="Edit"
            @click.stop="modalInstance.openEditModal(scope.row)"
            >编辑</el-button
          >
          <el-button
            v-if="config.tableConfig.actionColumn?.hasRowDeleteAction"
            link
            type="danger"
            size="small"
            v-show="
              config.tableConfig.actionColumn?.displayRowDeleteActionMethod === undefined
                ? true
                : !!config.tableConfig.actionColumn?.displayRowDeleteActionMethod(scope.row)
            "
            :icon="Delete"
            @click.stop="table.rowDelete(scope.row)"
            >删除</el-button
          >

          <el-button
            v-for="(item, buttonIndex) in config.tableConfig.actionColumn.buttons"
            :key="buttonIndex"
            link
            v-show="
              (item?.hide === undefined ? true : !item?.hide) &&
              (item?.displayMethod === undefined ? true : !!item?.displayMethod(scope.row))
            "
            :type="item?.type"
            :size="item?.size ? item.size : 'small'"
            :icon="item?.icon"
            :style="item?.style"
            @click.stop="table.tableRowActionOnClick(item?.onClick, scope.row, scope.$index)"
            >{{ item.label }}
          </el-button>
        </template>
      </el-table-column>

      <template v-slot:empty>
        <slot name="table-empty"></slot>
      </template>
    </el-table>

    <!-- page部分： 配置文件对象 pageConfig -->
    <el-pagination
      v-if="config.pageConfig"
      class="zh-table-pagination"
      :page-sizes="page?.sizes.value"
      :pager-count="page?.pagerCount.value"
      :layout="page?.layout.value"
      :total="pageData.total"
      v-model:currentPage="pageData.current"
      v-model:page-size="pageData.size"
      @current-change="page?.handleCurrentChange"
      @size-change="page?.handleCurrentChange"
    />

    <ZhFormModal
      ref="refZhModalForm"
      :modalConfig="modalInstance.modal.value"
      v-model="modalInstance.formModel.value"
      v-model:converted-model="modalInstance.convertedModel.value"
      :formConfig="modalInstance.formSettings.value"
      @cancel="modalInstance.cancel"
      @close="modalInstance.close"
      @submit="modalInstance.submit"
      @opened="modalInstance.opened"
    ></ZhFormModal>
  </div>
</template>

<script setup lang="ts">
  import { toRefs, PropType, computed, ref, Ref, watch, onMounted } from 'vue';
  import { Delete, Edit, CloseBold, Select } from '@element-plus/icons-vue';
  import dayjs from 'dayjs';
  import ZHForm from '../zh-form/index.vue';
  import ZhFormModal from '../zh-form-modal/index.vue';
  import ZHFormButtons from './form-buttons.vue';
  import { ElTable } from 'element-plus';
  import { TZHTablePageConfig, TZHTableConfig, TZHTable } from './type';
  import Page from './page';
  import Table from './table';
  import Form from './form';
  import Modal from './modal';
  import { TZHFromField, TZHFromFieldSelectOption } from '../zh-form/type';
  import storage from '@/utils/storage';
  import { createVueComponent } from '../hooks';

  const props = defineProps({
    config: {
      type: Object as PropType<TZHTable>,
      required: true, // 必传
    },
  });

  const { config } = toRefs(props);

  const refZHForm = ref();

  const emit = defineEmits(['changeModel', 'opened']);

  const isMobile = ref(storage.getIsMobile());

  const globalTable = ref({} as any);

  //#region common
  // 分页的组件内部数据
  const pageData: Ref<TZHTablePageConfig> = ref({
    total: 0,
    current: 1,
    size: 20,
  });
  //#endregion

  //#region search form
  const form = new Form(pageData, config.value.requestConfig, config.value.formConfig, refZHForm);
  globalTable.value.form = form;
  const watchFormModel = computed(() => {
    return JSON.parse(JSON.stringify(form.formModel.value));
  });

  watch(
    () => watchFormModel.value,
    (newVal: { [x: string]: any }, oldVal: { [x: string]: any }) => {
      if (!form._compareNeedTriggerSearchFieldsIsEqual(newVal, oldVal)) {
        table.debounceInitData();
      }

      emit('changeModel', newVal);
    },
    { immediate: false },
  );

  // 自定义插槽
  const sloTFromFields = config.value.formConfig?.fields?.filter(
    (x: TZHFromField) => x.type === 'slot',
  );
  //#endregion

  //#region table
  const refTable = ref<InstanceType<typeof ElTable>>();
  const table = new Table(
    config.value.tableConfig,
    refTable,
    config.value.requestConfig,
    form,
    pageData,
    emit,
    globalTable,
  );
  onMounted(() => {
    if (
      config.value.requestConfig?.list?.url &&
      (config.value.requestConfig.initialData ||
        config.value.requestConfig.initialData === undefined)
    )
      table.debounceInitData();
  });

  globalTable.value.table = table;
  //#endregion

  //#region page
  let page: undefined | Page;
  // console.log('usePage', usePage.value);
  if (config.value.pageConfig) page = new Page(config.value.pageConfig, pageData, table);
  //#endregion

  //#region add/edit modal
  const refZhModalForm = ref();
  const modalInstance = new Modal(
    config.value.requestConfig,
    refZhModalForm,
    config.value.tableConfig,
    emit,
    globalTable,
  );
  globalTable.value.modal = modalInstance;
  //#endregion

  defineExpose({
    // 表单
    getSearchFormModel: form.getSearchFormModel,
    setSearchFormModel: form.setSearchFormModel,
    getSearchFormParams: form.getSearchFormParams,
    // 弹窗
    openAddModal: modalInstance.openAddModal,
    executeOpenAddModal: modalInstance.executeOpenAddModal,
    setModalFormModel: modalInstance.setModalFormModel,
    // 表格
    debounceInitData: table.debounceInitData, // 防抖查询
    throttleInitData: table.throttleInitData, // 节流查询
    initData: table.initData, // 正常查询
    getData: table.getData, // 获取当前表格数据
    setData: table.setData,
    getDataAsync: table.getDataAsync, // 从接口获取表格数据，且不刷新表格
    getDataWithInitTable: table.getDataWithInitTable, // 获取接口数据，并刷新表格
    reloadTableTreeChild: table.reloadTableTreeChild,
  });
</script>

<script lang="ts">
  export default { name: 'ZHTable' };
</script>

<style lang="scss" scope>
  @import './index.scss';
</style>
