import type { App } from 'vue';
import { createPinia } from 'pinia';
import { createPersistedState } from 'pinia-plugin-persistedstate';
import useApiStore from './api';

const store = createPinia();

export function setupStore(app: App<Element>) {
    store.use(createPersistedState({ storage: sessionStorage }));
    app.use(store);
}

export { store, useApiStore };