import type { Router, RouteRecordRaw } from 'vue-router';
import type { App } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import { rangeRight } from 'lodash';
import { close, start } from '@/renderer/utils/nporgress';

import Home from '@/renderer/views/home/index.vue';

let router: Router = createRouter({
    history: createWebHashHistory(),
    routes: [{
        path: '/',
        name: 'home',
        component: Home,
    }],
    scrollBehavior: () => ({ left: 0, top: 0 }),
});
const files = import.meta.glob('./views/**/*.vue'); // 自定义规则
for (let i in files) {
  // console.log(123, i, files[i]);
  const newName = i.replace(/.\/views\//, '').replace(/.vue/, '');
  // console.log(13, newName, newName.toLocaleLowerCase(), files[i]);
  router.addRoute({
    path: '/' + newName.toLocaleLowerCase(),
    name: newName,
    component: files[i],
  });
}


router.beforeEach(async (to) => {
    // return true;
    start();
  });

router.afterEach(async () => {
    // return true;
    close();
});



export default router;
// export { router };

// // config router
// export async function setupRouter(app: App<Element>) {
//   const router = await getRouter();
//   app.use(router);
// }
