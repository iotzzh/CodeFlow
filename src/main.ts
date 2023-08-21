import 'element-plus/dist/index.css';
import './styles/global.css';

import '@vue-flow/core/dist/theme-default.css';
import '@vue-flow/core/dist/style.css';
import '@vue-flow/controls/dist/style.css';
import '@vue-flow/minimap/dist/style.css';
import '@vue-flow/node-resizer/dist/style.css';

import { createApp } from 'vue';
import { setupStore } from '@/stores/index';
import ElementPlus from 'element-plus';
import * as Icons from '@element-plus/icons-vue';
import locale from 'element-plus/dist/locale/zh-cn.mjs';

import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'


import router from '@/router/index';

import api from '@/api/index';


import App from './App.vue'

const app = createApp(App);

setupStore(app);

app.use(ElementPlus, { locale });
// 注册Icons 全局组件，element plus icon
Object.keys(Icons).forEach((key: string) => {
  app.component(key, Icons[key as keyof typeof Icons]);
});

app.use(router);
app.mount('#app');

// @ts-ignore: worker
self.MonacoEnvironment = {
  getWorker(_: string, label: string) {
    if (label === 'json') {
      return new jsonWorker()
    }
    if (['css', 'scss', 'less'].includes(label)) {
      return new cssWorker()
    }
    if (['html', 'handlebars', 'razor'].includes(label)) {
      return new htmlWorker()
    }
    if (['typescript', 'javascript'].includes(label)) {
      return new tsWorker()
    }
    return new EditorWorker()
  }
}
