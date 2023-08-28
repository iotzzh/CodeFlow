<template>
    <div class="frame-box" style="height: 100%;">
        <div class="empty" v-if="!hasContent">前端服务未启动</div>
        <iframe v-else id="iframe" :src="src" frameborder="0" height="100%" width="100%">
        </iframe>
    </div>
</template>

<!-- TODO: 当iframe加载完成后，再显示，否则显示服务未启动 -->
<script lang="ts" setup>
import { onMounted, ref, toRefs } from 'vue';

const props = defineProps({
  src: {
    type: String,
    required: true, // 必传
    default: 'http://'
  },
});

const { src } = toRefs(props);

const hasContent = ref(true);

// onMounted(() => {
//     const iframeDom = document.getElementById('iframe');
//     iframeDom!.onload = function() {

//     }
// });
</script>

<style lang="scss" scoped>
.empty {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
