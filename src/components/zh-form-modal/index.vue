<template>
  <ZHModal
    ref="refZHModal"
    :modalConfig="modalConfig"
    @close="zhFormModal.close"
    @submit="zhFormModal.submit"
    @cancel="zhFormModal.cancel"
    @opened="zhFormModal.opened"
    @closed="zhFormModal.closed"
  >
    <ZHForm
      ref="refZHForm"
      v-model="modelValue"
      v-bind:convertedModel="convertedModel"
      :formConfig="formConfig"
      @update:convertedModel="(value: any) => emit('update:convertedModel', value)"
    >
      <slot v-for="(item, index) in slotFields" :name="'zh-form-' + item.prop" :key="index" />
    </ZHForm>
  </ZHModal>
</template>

<script setup lang="ts">
  import { toRefs, PropType, ref, computed } from 'vue';
  import { TZHModal } from '../zh-modal/type';
  import ZHFormModal from './index';
  import { TZHformConfig } from '../zh-form/type';
  import ZHModal from '../zh-modal/index.vue';
  import ZHForm from '../zh-form/index.vue';

  const props = defineProps({
    modelValue: {
      type: Object as PropType<{ [x: string]: any }>,
      required: true,
    },

    convertedModel: {
      type: Object as PropType<{ [x: string]: any }>,
    },

    modalConfig: {
      type: Object as PropType<TZHModal>,
      required: true, // 必传
    },

    formConfig: {
      type: Object as PropType<TZHformConfig>,
      required: true,
    },
  });

  const { modalConfig, modelValue, formConfig } = toRefs(props);
  const refZHModal = ref();
  const refZHForm = ref();
  const emit = defineEmits([
    'close',
    'closed',
    'submit',
    'cancel',
    'update:modelValue',
    'update:convertedModel',
    'opened',
  ]);

  const zhFormModal = new ZHFormModal({
    emit,
    refZHModal,
    refZHForm,
    modelValue,
    formConfig,
    modalConfig,
  });

  const slotFields = computed(() => {
    return formConfig?.value?.fields?.filter((x: any) => x.type === 'slot');
  });

  defineExpose({
    open: zhFormModal.open,
    initForm: zhFormModal.initForm,
    clearFormData: zhFormModal.clearFormData,
    setModalFormModel: zhFormModal.setModalFormModel,
  });
</script>

<script lang="ts">
  export default { name: 'ZHFormModal' };
</script>

<!-- 注意： 这里使用的是全局样式！！！ -->
<style lang="scss">
  .el-dialog__header {
    text-align: center;
    font-size: 18px;
    font-weight: bolder;
    border-bottom: 1px solid rgba($color: #000000, $alpha: 0.1);
  }
</style>
