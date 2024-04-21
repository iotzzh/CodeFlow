<template>
  <div class="zh-tree" v-loading="loadingTree">
    <div class="top-box" v-if="tData && tData.length > 0">
      <el-input class="search-box" v-model="filterText" placeholder="搜索过滤" />
      <el-button
        class="add-button"
        v-if="config.treeConfig.hasRootAdd"
        type="success"
        @click="openModal(0)"
        >新增</el-button
      >
    </div>

    <el-scrollbar class="scrollbar">
      <el-tree
        v-if="tData && tData.length > 0"
        ref="refZHTree"
        class="tree"
        :data="tData"
        :props="config.treeConfig.defaultProps"
        :check-strictly="config.treeConfig.checkStrictly"
        :show-checkbox="config.treeConfig.showCheckbox"
        :indent="0"
        default-expand-all
        :filter-node-method="filterNode"
        @node-click="onNodeClick"
      >
        <template #default="{ node, data }">
          <span class="custom-tree-node">
            <el-tooltip
              popper-class="custom-tree-node-tooltip"
              effect="light"
              :disabled="
                !node.data[config.treeConfig.defaultProps.label] ||
                node.data[config.treeConfig.defaultProps.label].length <= labelDisplayMaxLength
              "
              :content="getTooltipHTMLContent(node.data[config.treeConfig.defaultProps.label])"
              placement="top"
              style="width: 100%"
              raw-content
            >
              <span>{{
                getTooltipOriginContent(node.data[config.treeConfig.defaultProps.label] || '')
              }}</span>
            </el-tooltip>

            <span class="actions">
              <el-icon
                v-if="config.treeConfig.hasAdd"
                class="icon"
                color="#6196EA"
                @click="(e: any) => openModal(1, e, node, data)"
              >
                <circle-plus />
              </el-icon>

              <el-icon
                v-if="config.treeConfig.hasEdit"
                class="icon"
                color="#6196EA"
                @click="(e: any) => openModal(2, e, node, data)"
              >
                <edit-pen />
              </el-icon>

              <el-icon
                v-if="config.treeConfig.hasDelete"
                class="icon"
                color="#FF0000"
                @click="(e:any) => remove(node, data, e)"
              >
                <delete />
              </el-icon>
            </span>
          </span>
        </template>
      </el-tree>
      <div v-else class="empty">
        <el-icon v-if="config.treeConfig.hasEmptyAdd" :size="40" @click="openModal(0)">
          <Plus />
        </el-icon>
        <span v-else style="color: #767c88">暂<br />无<br />数<br />据</span>
      </div>
    </el-scrollbar>

    <ZHFormModal
      v-if="config.formModalConfig"
      :model-value="formModel"
      :converted-model="convertedFormModel"
      :form-config="config.formModalConfig.formConfig"
      :modal-config="modal"
      @cancel="() => (modal.show = false)"
      @close="() => (modal.show = false)"
      @submit="submit"
    ></ZHFormModal>
  </div>
</template>

<script setup lang="ts">
  // 组件思想
  // input: config
  // output: event(data)
  import { toRefs, PropType, computed, ref, reactive, Ref, watch, onMounted } from 'vue';
  import { Plus } from '@element-plus/icons-vue';
  import ZHFormModal from '../zh-form-modal/index.vue';
  import { TZHModal } from '../zh-modal/type';
  import { TZHFromField } from '../zh-form/type';
  import { TZHTree } from './type';
  import ZHRequest from '../zh-request';
  import { TZHRequestParams } from '../zh-request/type';
  import { isMessageConfirm } from '../zh-message';

  const props = defineProps({
    config: {
      type: Object as PropType<TZHTree>,
      required: true,
    },
  });

  const emit = defineEmits(['nodeclick']);

  const { config } = toRefs(props);
  const refZHTree = ref();

  //#region Tree
  const loadingTree = ref(false);
  const filterText = ref('');
  const tData = ref([] as any);
  const labelDisplayMaxLength = computed(() => {
    return config.value.treeConfig.labelDisplayMaxLength || 30;
  });
  const arrayToTree = (list: Array<any>, parent = 0): any => {
    return list
      .filter((item) => item.parent === parent)
      .map((item) => ({ ...item, children: arrayToTree(list, item.id) }));
  };

  const getTreeData = async () => {
    loadingTree.value = true;
    const params: TZHRequestParams = {
      url: config.value.requestConfig?.urlGet || '',
      conditions: config.value.requestConfig?.conditionsGet,
    };
    const result = await ZHRequest.post(params);
    const treeRecords = arrayToTree(result?.data?.records);
    tData.value = treeRecords;
    loadingTree.value = false;
  };

  const setData = (data: any) => {
    loadingTree.value = true;
    tData.value = data;
    loadingTree.value = false;
  };

  onMounted(async () => {
    if (config.value.treeConfig.initialData === undefined || config.value.treeConfig.initialData)
      getTreeData();
  });

  watch(filterText, (val) => {
    refZHTree.value && refZHTree.value!.filter(val);
  });

  const filterNode = (value: string, data: any) => {
    if (!value) return true;
    return data.label.includes(value);
  };

  const getTooltipHTMLContent = (content: string) => {
    return '<div style="width: 300px; word-break: break-all;">' + content + '</div>';
  };

  const getTooltipOriginContent = (content: string) => {
    if (content.length > labelDisplayMaxLength.value) {
      return content.substring(0, labelDisplayMaxLength.value) + '...';
    } else return content;
  };

  const remove = async (node: any, data: any, e: any) => {
    e && e.stopPropagation();
    const msgResult = await isMessageConfirm('确认删除？', '提示');
    if (!msgResult) return;
    const params: TZHRequestParams = {
      url: config.value.requestConfig?.urlDelete || '',
      conditions: { ...data, ...config.value.requestConfig?.conditionsDelete },
    };
    const result: any = await ZHRequest.post(params);
    if (result.success) {
      getTreeData();
    }
  };

  //#endregion

  //#region Form

  const formModel = ref({} as any);
  const convertedFormModel = ref({} as any);
  //#endregion

  //#region Modal
  const modal = ref({
    show: false,
    title: '新增',
    loadingSubmit: false,
  } as TZHModal);

  // 0: 总， 1：新增， 2：编辑
  const openModal = (type: number, e?: any, node?: any, data?: any) => {
    e && e.stopPropagation();
    const fields = config.value.formModalConfig?.formConfig?.fields as TZHFromField[];
    if (type === 0) {
      modal.value.type = 'add';
    } else if (type === 1) {
      modal.value.type = 'add';
    } else if (type === 2) {
      modal.value.type = 'edit';
      modal.value.title = '编辑';
      formModel.value = data;
    } else {
    }

    modal.value.show = true;

    modal.value = {
      ...config.value.formModalConfig?.modalConfig,
      ...modal.value,
    };
  };

  const closeModal = () => {
    modal.value.show = false;
    formModel.value = {};
  };

  const submit = async () => {
    modal.value.loadingSubmit = true;
    const url =
      (modal.value.type === 'add'
        ? config.value.requestConfig?.urlAdd
        : config.value.requestConfig?.urlEdit) || '';
    const params: TZHRequestParams = {
      url,
      conditions: formModel.value,
    };
    const result: any = await ZHRequest.post(params);
    if (result.success) {
      closeModal();
      getTreeData();
    }

    modal.value.loadingSubmit = false;
  };

  const onNodeClick = (data: any, node: any, item: any, param: any) => {
    emit('nodeclick', { data, node, item, param });
    if (!config.value.treeConfig.nodeClick) return;
    if (typeof config.value.treeConfig.nodeClick === 'string') {
      new Function('params', config.value.treeConfig.nodeClick)({
        data,
        node,
        item,
        param,
      });
    } else {
      config.value.treeConfig.nodeClick({ data, node, item, param });
    }
  };
  //#endregion

  defineExpose({
    setData,
  });
</script>

<script lang="ts">
  export default { name: 'ZHTree' };
</script>

<style lang="scss" scope>
  @import './index.scss';
</style>
