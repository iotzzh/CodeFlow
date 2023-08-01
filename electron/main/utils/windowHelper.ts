import { BrowserWindow, shell } from "electron";
import { join } from 'node:path';



export default class WindowHelper {
    static createWindow (cofig: { [x:string] :any } = {}) {
        const preload = join(__dirname, '../preload/index.js')
        const url = process.env.VITE_DEV_SERVER_URL
        const indexHtml = join(process.env.DIST, 'index.html')

        const win = new BrowserWindow({
            title: 'Code Flow',
            icon: join(process.env.PUBLIC, 'favicon.ico'),
            autoHideMenuBar: true, // 隐藏菜单栏
            webPreferences: {
              preload,
              webSecurity: false,
              nodeIntegration: true,
              contextIsolation: false,  
            },
        });

        if (process.env.VITE_DEV_SERVER_URL) { // electron-vite-vue#298
            win.loadURL(url)
            // Open devTool if the app is not packaged
            win.webContents.openDevTools()
          } else {
            win.loadFile(indexHtml)
          }
        
          // Test actively push message to the Electron-Renderer
          win.webContents.on('did-finish-load', () => {
            win?.webContents.send('main-process-message', new Date().toLocaleString())
          })
        
          // Make all links open with the browser, not with the application
          win.webContents.setWindowOpenHandler(({ url }) => {
            if (url.startsWith('https:')) shell.openExternal(url)
            return { action: 'deny' }
          })


          return win;
    };
}
