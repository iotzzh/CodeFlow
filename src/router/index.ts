import type { Router, RouteRecordRaw } from 'vue-router';
import type { App } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import { rangeRight } from 'lodash';
import { close, start } from '@/utils/nporgress';

import Home from '@/views/home/index.vue';

let router: Router = createRouter({
    history: createWebHashHistory(),
    routes: [{
        path: '/',
        name: 'home',
        component: Home,
    }],
    scrollBehavior: () => ({ left: 0, top: 0 }),
});
const files = import.meta.glob('@/views/**/*.vue'); // 自定义规则
for (let key in files) {
  // const path = key.replace('\/views', '').replace('.vue', '');
  const name = key.split('/')[3];
  if (name === 'home') continue;

  router.addRoute({
    path: `/${name}`,
    name,
    component: files[key],
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
