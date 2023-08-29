import { defineStore } from 'pinia';

export default defineStore({
  id: 'file',
  state: () => ({
    workspace: '',
  }),

  persist: true,
  
  getters: {
    // doubleCount: (state) => state.counter * 2
  },
  
  actions: {
    setWorkspace(workspace: string):void {
        this.workspace = workspace;
    },
    clearWorkspace() {
        this.workspace = '';
    }
  }
});
