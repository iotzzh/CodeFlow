import { BrowserWindow, shell, screen } from "electron";
import { join } from 'node:path';

export default class WindowHelper {
    static async createWindow (config: { [x:string] :any } = {}) {
        const preload = join(__dirname, '../preload/index.js')
        const url = process.env.VITE_DEV_SERVER_URL
        const indexHtml = join(process.env.DIST, 'index.html')

        const win = new BrowserWindow({
            title: 'Code Flow',
            parent: Object.keys(config).length > 0 ? globalThis.mainWidow : null,
            modal: Object.keys(config).length > 0,
            icon: join(process.env.PUBLIC, 'favicon.ico'),
            frame: Object.keys(config).length === 0,
            width: config.fullscreenWithTop ? screen.getPrimaryDisplay().workAreaSize.width : 1400, 
            height: config.fullscreenWithTop ? screen.getPrimaryDisplay().workAreaSize.height : 800, 
            fullscreen: config.fullscreen === undefined ? false : config.fullscreen,
            minimizable: config.minimizable === undefined ? true : config.minimizable,
            maximizable: config.maximizable === undefined ? true : config.maximizable,
            closable: config.closable === undefined ? true : config.closable,
            fullscreenable: config.fullscreenable === undefined ? true : config.fullscreenable,
            autoHideMenuBar: true, // 隐藏菜单栏
            webPreferences: {
              preload,
              webSecurity: false,
              nodeIntegration: true,
              contextIsolation: false,  
            },
        });

        if (process.env.VITE_DEV_SERVER_URL) { // electron-vite-vue#298
            config.route ? await win.loadURL(`${url}#${config.route}`) :  await win.loadURL(url);
            // Open devTool if the app is not packaged
            win.webContents.openDevTools()
          } else {
            config.route ?  await win.loadFile(indexHtml) :  await win.loadFile(indexHtml, { hash: config.route });
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


// function createWindow1 (config: { [x:string]:any } = {}) {
//   const window1 = new BrowserWindow({
//     parent: Object.keys(config).length > 0 ? win : null,
//     modal: Object.keys(config).length > 0,
//     frame: Object.keys(config).length === 0,
//     width: config.fullscreenWithTop ? screen.getPrimaryDisplay().workAreaSize.width : 1400, 
//     height: config.fullscreenWithTop ? screen.getPrimaryDisplay().workAreaSize.height : 800, 
//     fullscreen: config.fullscreen === undefined ? false : config.fullscreen,
//     minimizable: config.minimizable === undefined ? true : config.minimizable,
//     maximizable: config.maximizable === undefined ? true : config.maximizable,
//     closable: config.closable === undefined ? true : config.closable,
//     fullscreenable: config.fullscreenable === undefined ? true : config.fullscreenable,
//     autoHideMenuBar: true, // 隐藏菜单栏
//     webPreferences: {
//       preload,
//       // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
//       // Consider using contextBridge.exposeInMainWorld
//       // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
//       nodeIntegration: true,
//       contextIsolation: false,

//        // 禁用同源策略，允许跨域
//        webSecurity: false
//     },
//   });

//   if (process.env.VITE_DEV_SERVER_URL) {
//     window1.loadURL(`${url}#${config.route}`)
//   } else {
//     window1.loadFile(indexHtml, { hash: config.route })
//   }

//   // if (process.env.NODE_ENV === 'development') {
//   //   const rendererPort = process.argv[2];
//   //   window.loadURL(`http://localhost:${rendererPort}` + `/${config.route ? '#/' + config.route : ''}`);
//   // }
//   // else {
//   //   if (process.env.VITE_DEV_SERVER_URL) {
//   //     window.loadURL(`${url}#${config}`)
//   //   } else {
//   //     window.loadFile(indexHtml, { hash: config })
//   //   }

//   //   // window.loadFile(join(app.getAppPath(), 'index.html'), {
//   //   //   hash: `${config.route || ''}`
//   //   // });
//   // }

//   return window1;
// }