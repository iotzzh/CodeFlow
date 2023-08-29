import type { App } from 'vue';
import { createPinia } from 'pinia';
import { createPersistedState } from 'pinia-plugin-persistedstate';
import useApiStore from './api';
import useWorkspaceStore from './workspace';

const store = createPinia();

export function setupStore(app: App<Element>) {
    store.use(createPersistedState({ storage: sessionStorage }));
    app.use(store);
}

export { store, useApiStore, useWorkspaceStore };