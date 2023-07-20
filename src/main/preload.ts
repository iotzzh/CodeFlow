import {contextBridge, ipcRenderer} from 'electron';
// main progress is Render
contextBridge.exposeInMainWorld('electronAPI', {
  createWindow: (config: { [x:string]:any }) => ipcRenderer.send('createWindow', config),
  sendMessage: (message: string) => ipcRenderer.send('message', message),
  onUpdateCounter: (callback) => ipcRenderer.on('receiveMessage', callback)
})
