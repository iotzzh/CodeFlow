<template>
    <div class="basic">
        <!-- <el-collapse v-model="activeName" accordion>
            <el-collapse-item title="表单配置" name="1">
                <div>搜索表单配置</div>
            </el-collapse-item>
            <el-collapse-item title="表格配置" name="2">
                <div>表格配置</div>
            </el-collapse-item>
            <el-collapse-item title="分页配置" name="3">
                <div>分页配置</div>
            </el-collapse-item>
        </el-collapse> -->

        <ZHMonacoEditor v-model="content" :language="language" height="100%" style="margin-top: 40px" @editor-mounted="editorMounted" @change="editorChage"></ZHMonacoEditor>

    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, PropType, toRefs } from 'vue';
import * as monaco from 'monaco-editor'
import ZHMonacoEditor from '@/components/zh-monaco-editor/index.vue';
import ZHRequest from '@/components/zh-request';
import api from '@/api';

import { useWorkspaceStore } from '@/stores/index';
import { popErrorMessage } from '@/components/zh-message';

const props = defineProps({
    routeNode: {
    type: Object as PropType<any>,
    required: true, // 必传
  },
});

const { routeNode } = toRefs(props);


const workspaceStore = useWorkspaceStore();

const content = ref('{}')
const language = ref('json')
const editorMounted = (editor: monaco.editor.IStandaloneCodeEditor) => {
    console.log('editor实例加载完成', editor)
}

const updateContent = async (value:string) => {
    const params = {
        url: api.updatePageSetting,
        conditions: {
            address: workspaceStore.address,
            folder: routeNode.value.url,
            content: value
        },
    };
    const res:any = await ZHRequest.post(params);
    if (!res.success) {
        popErrorMessage('修改配置文件失败，请检查或刷新后重试');
        return;
    }
};

const editorChage = async (value:string) => {
   setTimeout(() => {
    updateContent(value);
   }, 2000);
};

onMounted(async () => {
    const params = {
        url: api.getPageSetting,
        conditions: {
            address: workspaceStore.address,
            folder: routeNode.value.url,
        },
    };
    const res:any = await ZHRequest.post(params);
    if (!res.success) {
        popErrorMessage('获取配置文件失败，请检查或刷新后重试');
        return;
    }
    content.value = res.data;
});

const activeName = ref('1');
</script>