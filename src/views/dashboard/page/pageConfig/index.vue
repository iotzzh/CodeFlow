<template>
    <div class="page-config">
        <Basic :route-node="routeNode"></Basic>

        <div class="actions">
            <el-button link type="primary" icon="Upload">导入</el-button>
            <el-button link type="success" icon="DocumentCopy">拷贝</el-button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { PropType, toRefs } from 'vue';
import Basic from './Basic.vue'

const props = defineProps({
    routeNode: {
    type: Object as PropType<any>,
    required: true, // 必传
  },
});

const { routeNode } = toRefs(props);

</script>

<style lang="scss" scoped>
.page-config {
    display: flex;
    flex-direction: column;
    height: 100%;
}

.page-config>div:first-child {
    flex: 1;
    overflow: hidden;
}

.actions {
    height: 30px;
}

</style>