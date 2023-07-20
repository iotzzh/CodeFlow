import {app, BrowserWindow, ipcMain, session, screen } from 'electron';
import {join} from 'path';

let mainWindow;
let subWindows = {};


function createWindow (config: { [x:string]:any } = {}) {
  const window = new BrowserWindow({
    // parent: Object.keys(config).length > 0 ? mainWindow : null,
    modal: Object.keys(config).length > 0,
    width: config.fullscreenWithTop ? screen.getPrimaryDisplay().workAreaSize.width : 1400, 
    height: config.fullscreenWithTop ? screen.getPrimaryDisplay().workAreaSize.height : 800, 
    fullscreen: config.fullscreen === undefined ? false : config.fullscreen,
    minimizable: config.minimizable === undefined ? true : config.minimizable,
    maximizable: config.maximizable === undefined ? true : config.maximizable,
    closable: config.closable === undefined ? true : config.closable,
    fullscreenable: config.fullscreenable === undefined ? true : config.fullscreenable,
    autoHideMenuBar: true, // 隐藏菜单栏
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: true,
      // 禁用同源策略，允许跨域
      webSecurity: false
    }
  });

  if (process.env.NODE_ENV === 'development') {
    const rendererPort = process.argv[2];
    window.loadURL(`http://localhost:${rendererPort}` + `/${config.route ? '#/' + config.route : ''}`);
  }
  else {
    window.loadFile(join(app.getAppPath(), 'renderer', 'index.html'), {
      hash: '/' + `${config.route ? '/' + config.route : ''}`
    });
  }

  return window;
}

// app.on('ready', async () => {
//   mainWindow = createWindow();
// })

app.whenReady().then(() => {
  mainWindow = createWindow();

  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': ['script-src \'self\'']
      }
    })
  })

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      mainWindow = createWindow();
    }
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
});

ipcMain.on('message', (event, message) => {
  console.log('received:message:', message);
  mainWindow && mainWindow.webContents.send("receiveMessage", "我是主进程已收到消息"); // 响应渲染进程
})

ipcMain.on('createWindow', (event, config: { [x:string]:any }) => {
  subWindows[config.id] = createWindow(config);
  mainWindow.minimize();
});


// ipcMain.on('window1', (e, args) => {
//   console.log('e', e);
//   console.log('args:', args);
// })