<template>
    <div class="box">
        <VMonacoEditor v-model="content" :language="language" height="500px" 
                    style="margin-top: 40px" @editor-mounted="editorMounted" ></VMonacoEditor>
    </div>
</template>

<script lang="ts" setup>
import VMonacoEditor from '@/components/monacoEditor/index.vue';

import { ref } from 'vue'
const activeName = ref('1')

import * as monaco from 'monaco-editor'
const content = ref(`
{
    "server": {
        "port": 8000,
        "strictPort": false,
        "force": true,
        "host": "0.0.0.0",
        "https": false,
        "cors": true,
        "open": true,
        "hmr": true,
        "proxy": {
        "/apiUser1": {
          "target": "http://localhost:8000/apiMock/",
          "changeOrigin": true
        }
      }
    }
}
`)
const language = ref('json')
const editorMounted = (editor: monaco.editor.IStandaloneCodeEditor) => {
    console.log('editor实例加载完成', editor)
}
</script>