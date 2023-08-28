<template>
    <div class="frame-box" style="height: 100%;">
        <div class="empty" v-if="!hasContent">前端服务未启动</div>
        <iframe v-else id="iframe" src="http://localhost:8000" frameborder="0" height="100%" width="100%">
        </iframe>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';

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
