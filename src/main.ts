import 'element-plus/dist/index.css';
import './styles/global.css';

import { createApp } from 'vue'
import ElementPlus from 'element-plus';
import * as Icons from '@element-plus/icons-vue';
import locale from 'element-plus/dist/locale/zh-cn.mjs';

import router from '@/router/index';


import App from './App.vue'

const app = createApp(App);
app.use(ElementPlus, { locale });
  // 注册Icons 全局组件，element plus icon
Object.keys(Icons).forEach((key:string) => {
  app.component(key, Icons[key as keyof typeof Icons]);
});

app.use(router);
app.mount('#app');
