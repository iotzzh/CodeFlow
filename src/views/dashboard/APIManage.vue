<template>
  <div class="box">
    <el-row class="row">
      <el-col :span="12" class="col">
        <el-button v-for="file in fileList" @click="() => clickFile(file)"> {{ file.name }}</el-button>
      </el-col>
      <el-col :span="12" class="col">
        <el-button v-for="api in selectedFile.data.api"> {{ api.name }}</el-button>
      </el-col>
    </el-row>
    
  </div>
</template>

<script lang="ts" setup>
import { nextTick, onMounted, ref } from 'vue';
import { ipcRenderer } from "electron";

const fileList = ref([] as any);
const selectedFile = ref({} as any);
onMounted(async () => {
  await nextTick();
  fileList.value = ipcRenderer.sendSync('file:getApiList', '');
});

const clickFile = (file:any) => {
  selectedFile.value = file;
  console.log('file', file);
};


</script>

<style>
.box {
  height: 100%;
  width: 100%;
}

.row, .col {
  height: 100%;
}
</style>