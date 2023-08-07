<script setup lang="ts">
import { ipcRenderer } from 'electron';
import { ref } from 'vue';

const unLoaded = ref(false);
ipcRenderer.on('mainWindowLoaded', () => {
      // 在主窗口加载完成后执行你的渲染线程操作
      console.log('Main window loaded in the renderer process');
      setTimeout(() => {
        unLoaded.value = false;
      }, 10000);
    });
</script>

<template>
  <div v-if="unLoaded">loading....</div>
  <router-view v-else />
</template>

