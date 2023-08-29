import { defineStore } from 'pinia';

export default defineStore({
  id: 'workspace',
  state: () => ({
    address: '',
    port: 0,
  }),

  persist: true,
  
  getters: {
    // doubleCount: (state) => state.counter * 2
  },
  
  actions: {
    setAddress(address: string):void {
        this.address = address;
    },
    clearWorkspace() {
        this.address = '';
    },
    setPort(port: number):void {
      this.port = port;
  },
  }
});
