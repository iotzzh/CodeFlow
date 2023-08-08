<template>
    <div class="demo-collapse">
        <el-collapse v-model="activeName" accordion>
            <el-collapse-item title="本地环境" name="1">
                <VMonacoEditor v-model="content" :language="language" height="500px" 
                    style="margin-top: 40px" @editor-mounted="editorMounted" ></VMonacoEditor>
            </el-collapse-item>
            <el-collapse-item title="开发环境" name="2">
                <VMonacoEditor v-model="content" :language="language" height="500px" 
                    style="margin-top: 40px" @editor-mounted="editorMounted" ></VMonacoEditor>
            </el-collapse-item>
            <el-collapse-item title="测试环境" name="3">
                <VMonacoEditor v-model="content" :language="language" height="500px" 
                    style="margin-top: 40px" @editor-mounted="editorMounted" ></VMonacoEditor>
            </el-collapse-item>
            <el-collapse-item title="生成环境" name="4">
                <VMonacoEditor v-model="content" :language="language" height="500px" 
                    style="margin-top: 40px" @editor-mounted="editorMounted" ></VMonacoEditor>
            </el-collapse-item>
        </el-collapse>
    </div>
</template>
  
<script lang="ts" setup>
import { ref } from 'vue'
import VMonacoEditor from '@/components/monacoEditor/index.vue';
const activeName = ref('1')

import * as monaco from 'monaco-editor'
const content = ref(`
VITE_PUBLIC_PATH=

# 添加到配置文件的原因 可以设置某个项目原始布局，而不需要修改代码
# 当界面存在切换按钮时，也会先从storage取, 默认：vertical
VITE_LAYOUT=horizontal

# 设置路由数据来源：file, directory, api
# 分别代表：来自静态文件，根据目录结构生成，通过api请求获得
VITE_ROUTE_DATA_SOURCE=file
`)
const language = ref('ini')
const editorMounted = (editor: monaco.editor.IStandaloneCodeEditor) => {
    console.log('editor实例加载完成', editor)
}
</script>