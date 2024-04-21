<template>
  <el-dialog
    v-model="modalConfig.show"
    v-if="modalConfig.show"
    :title="modalConfig.title"
    :closeOnClickModal="false"
    :width="isMobile ? '90%' : modalConfig.width || ''"
    @close="zhModal.close"
    :top="modalConfig.top"
    :fullscreen="zhModal.fullscreen.value"
    :class="classNames"
    @opened="zhModal.opened"
    :append-to-body="true"
    @closed="zhModal.closed"
    :destroy-on-close="modalConfig.destroyOnClose"
    :show-close="modalConfig.showClose === undefined ? false : modalConfig.showClose"
  >
    <div class="body-box" v-loading="modalConfig.loadingPage">
      <slot></slot>
    </div>

    <template #header>
      <div class="header">
        <div class="left"></div>
        <div class="center">{{ modalConfig.title }}</div>
        <div class="right">
          <el-button link @click="zhModal.toggleFullScreen" type="primary">
            <i v-if="zhModal.fullscreen.value" class="iconfont icon-fullscreen-shrink"></i>
            <i v-else class="iconfont icon-fullscreen-expand"></i>
          </el-button>
          <el-button link @click="zhModal.close" type="primary" style="margin-left: 0px"
            ><i class="iconfont icon-close_light"></i
          ></el-button>
        </div>
      </div>
    </template>

    <template #footer v-if="modalConfig.footer">
      <span class="dialog-footer">
        <el-button
          @click="zhModal.cancel"
          v-if="
            modalConfig.footer?.hasCancelButton || modalConfig.footer?.hasCancelButton === undefined
          "
          >取消</el-button
        >
        <el-button
          type="primary"
          :loading="modalConfig.loadingSubmit"
          @click="zhModal.submit"
          v-if="
            modalConfig.footer?.hasSubmitButton || modalConfig.footer?.hasSubmitButton === undefined
          "
          >确定</el-button
        >
      </span>
      <slot name="footer" />
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
  import storage from '@/utils/storage';
  import { computed } from '@vue/reactivity';
  import { toRefs, PropType, ref } from 'vue';
  import { ZHModal } from './index';
  import { TZHModal } from './type';

  const props = defineProps({
    modalConfig: {
      type: Object as PropType<TZHModal>,
      required: true, // 必传
    },
  });

  const { modalConfig } = toRefs(props);

  const emit = defineEmits(['close', 'closed', 'submit', 'cancel', 'open', 'opened']);

  const isMobile = ref(storage.getIsMobile());

  const zhModal = new ZHModal(modalConfig, emit);

  const classNames = computed(() => {
    return (
      (modalConfig.value.customClass || '') +
      ' zh-modal ' +
      (zhModal.fullscreen.value ? 'vh80' : 'vh60')
    );
  });

  defineExpose({
    open: zhModal.open,
    close: zhModal.close,
  });
</script>

<script lang="ts">
  export default { name: 'ZHModal' };
</script>

<!-- 注意：这里使用的全局样式！！！ -->
<style lang="scss">
  .zh-modal {
    .el-dialog__body {
      padding: 0px;
      overflow-y: auto;
      // height: 60vh;
    }
  }

  .zh-modal.vh80 {
    .el-dialog__body {
      max-height: 80vh;
    }
  }

  .zh-modal.vh60 {
    .el-dialog__body {
      max-height: 60vh;
    }
  }

  .el-dialog__header {
    text-align: center;
    font-size: 18px;
    font-weight: bolder;
    border-bottom: 1px solid rgba($color: #000000, $alpha: 0.1);
    margin-right: 0px;
  }

  .body-box {
    height: 100%;
    width: 100%;
    overflow-x: hidden;
    overflow-y: auto;
  }

  .header {
    display: flex;

    div {
      flex: 1;
    }

    .right {
      text-align: right;
    }
  }

  .iconfont {
    cursor: pointer;
  }
</style>
