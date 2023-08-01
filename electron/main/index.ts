import { app, BrowserWindow, shell, ipcMain, screen, dialog } from 'electron'
import { release } from 'node:os'
import { join } from 'node:path'
import DBHelper from './db'
import Init from './init'
import WindowHelper from './utils/windowHelper'

Init.initProcess();

DBHelper.openDB();

let win: BrowserWindow | null = null
let subWindows = {};


// async function createWindow() {
//   win = new BrowserWindow({
//     title: 'Code Flow',
//     icon: join(process.env.PUBLIC, 'favicon.ico'),
//     autoHideMenuBar: true, // 隐藏菜单栏
//     webPreferences: {
//       preload,
//       webSecurity: false,
//       nodeIntegration: true,
//       contextIsolation: false,  
//     },
//   })

//   if (process.env.VITE_DEV_SERVER_URL) { // electron-vite-vue#298
//     win.loadURL(url)
//     // Open devTool if the app is not packaged
//     win.webContents.openDevTools()
//   } else {
//     win.loadFile(indexHtml)
//   }

//   // Test actively push message to the Electron-Renderer
//   win.webContents.on('did-finish-load', () => {
//     win?.webContents.send('main-process-message', new Date().toLocaleString())
//   })

//   // Make all links open with the browser, not with the application
//   win.webContents.setWindowOpenHandler(({ url }) => {
//     if (url.startsWith('https:')) shell.openExternal(url)
//     return { action: 'deny' }
//   })
//   // win.webContents.on('will-navigate', (event, url) => { }) #344
// }

app.whenReady().then(() => {
  win = WindowHelper.createWindow();
})

app.on('window-all-closed', () => {
  win = null
  if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    allWindows[0].focus()
  } else {
    createWindow()
  }
})

// New window example arg: new windows url
ipcMain.handle('open-win', (_, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${url}#${arg}`)
  } else {
    childWindow.loadFile(indexHtml, { hash: arg })
  }
})


function createWindow1 (config: { [x:string]:any } = {}) {
  const window1 = new BrowserWindow({
    parent: Object.keys(config).length > 0 ? win : null,
    modal: Object.keys(config).length > 0,
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
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      nodeIntegration: true,
      contextIsolation: false,

       // 禁用同源策略，允许跨域
       webSecurity: false
    },
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    window1.loadURL(`${url}#${config.route}`)
  } else {
    window1.loadFile(indexHtml, { hash: config.route })
  }

  // if (process.env.NODE_ENV === 'development') {
  //   const rendererPort = process.argv[2];
  //   window.loadURL(`http://localhost:${rendererPort}` + `/${config.route ? '#/' + config.route : ''}`);
  // }
  // else {
  //   if (process.env.VITE_DEV_SERVER_URL) {
  //     window.loadURL(`${url}#${config}`)
  //   } else {
  //     window.loadFile(indexHtml, { hash: config })
  //   }

  //   // window.loadFile(join(app.getAppPath(), 'index.html'), {
  //   //   hash: `${config.route || ''}`
  //   // });
  // }

  return window1;
}

ipcMain.on('message', (event, message) => {
  console.log('received:message:', message);
  win && win.webContents.send("receiveMessage", "我是主进程已收到消息"); // 响应渲染进程
})

ipcMain.on('createWindow', (event, config: { [x:string]:any }) => {
  subWindows[config.id] = createWindow1(config);
  win.minimize();
});

ipcMain.on('min', (event, id) => subWindows[id].minimize());
ipcMain.on('max', (event, id) => {
    if (subWindows[id].isMaximized()) {
      subWindows[id].unmaximize()
    } else {
      subWindows[id].maximize()
    }
});
ipcMain.on('close', (event, id) => subWindows[id].close());

// 命令行工具： code E:\practice\zh-skill-tree\code\web\zh-admin-vue
ipcMain.on('open-code-by-ide', (event, ide, address) => {
  // switch(ide) {
  //   case 'vscode': 
  //   var exec = require('child_process').exec;
  //   exec(`code E:\\practice\\zh-skill-tree\\code\\web\\zh-admin-vue`);
    // const shell = require('shelljs');
    // const res = shell.exec(`code E:\\practice\\zh-skill-tree\\code\\web\\zh-admin-vue`);
    // console.log(JSON.stringify(res));

// 同步
// 执行 git status 命令
// const { code } = shell.exec('git status');

/*
* 返回一个对象
* 可以根据 code 值来判断当前命令是否执行成功
* code === 0 代表成功
* */

// 异步回调
// 执行 git add . 命令
// shell.exec('git add .', function(code, stdout, stderr) {
//   console.log('Exit code:', code);
//   console.log('Program output:', stdout);
//   console.log('Program stderr:', stderr);
//   if (code===0) {
//     console.log('成功')
//     // do something
//   }
// });
    // break;
  // }
});

// ipcMain.on("sendMessage", (event, args) => {
//   console.log("收到渲染进程的消息",  args);
//   subWindows[0] && subWindows[0].webContents.send("receiveMessage", "我是主进程已收到消息" + args); // 响应渲染进程
// });


// ipcMain.on('openDialog',(event)=>{
//   dialog.showOpenDialog({
      
//   }).then(result=>{
//       console.log(result);        //输出结果
//       result.filePaths.length>0 && win.webContents.send(result);
//   })
// })

ipcMain.on('openDialog', async (event:any) => {
  // const res = await dialog.showOpenDialog(win, { title: '测试',  properties: ['openDirectory']});
  // console.log(res);
});

