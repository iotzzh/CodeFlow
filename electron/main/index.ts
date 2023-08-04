import DBHelper from './db/index';
import Init from './utils/init';
import { addMessageListener } from './message/index';
import Controller from './controller/index';
import WindowHelper from './utils/windowHelper';
import { app, BrowserWindow, shell, ipcMain, screen, dialog } from 'electron'
import { release } from 'node:os'
import { join } from 'node:path'

async function bootstrap () {
    await DBHelper.openDB();

    await Controller.init();
    
    Init.initProcess();
    
    await Init.initAPP();
  
    await addMessageListener();
}

bootstrap();





// let subWindows = {};

// New window example arg: new windows url
// ipcMain.handle('open-win', (_, arg) => {
//   const childWindow = new BrowserWindow({
//     webPreferences: {
//       preload,
//       nodeIntegration: true,
//       contextIsolation: false,
//     },
//   })

//   if (process.env.VITE_DEV_SERVER_URL) {
//     childWindow.loadURL(`${url}#${arg}`)
//   } else {
//     childWindow.loadFile(indexHtml, { hash: arg })
//   }
// })






// ipcMain.on('message', (event, message) => {
//   // console.log('received:message:', message);
//   // win && win.webContents.send("receiveMessage", "我是主进程已收到消息"); // 响应渲染进程
// })



// ipcMain.on('min', (event, id) => subWindows[id].minimize());
// ipcMain.on('max', (event, id) => {
//     // if (subWindows[id].isMaximized()) {
//     //   subWindows[id].unmaximize()
//     // } else {
//     //   subWindows[id].maximize()
//     // }
// });
// ipcMain.on('close', (event, id) => subWindows[id].close());

// // 命令行工具： code E:\practice\zh-skill-tree\code\web\zh-admin-vue
// ipcMain.on('open-code-by-ide', (event, ide, address) => {
//   // switch(ide) {
//   //   case 'vscode': 
//   //   var exec = require('child_process').exec;
//   //   exec(`code E:\\practice\\zh-skill-tree\\code\\web\\zh-admin-vue`);
//     // const shell = require('shelljs');
//     // const res = shell.exec(`code E:\\practice\\zh-skill-tree\\code\\web\\zh-admin-vue`);
//     // console.log(JSON.stringify(res));

// // 同步
// // 执行 git status 命令
// // const { code } = shell.exec('git status');

// /*
// * 返回一个对象
// * 可以根据 code 值来判断当前命令是否执行成功
// * code === 0 代表成功
// * */

// // 异步回调
// // 执行 git add . 命令
// // shell.exec('git add .', function(code, stdout, stderr) {
// //   console.log('Exit code:', code);
// //   console.log('Program output:', stdout);
// //   console.log('Program stderr:', stderr);
// //   if (code===0) {
// //     console.log('成功')
// //     // do something
// //   }
// // });
//     // break;
//   // }
// });

// // ipcMain.on("sendMessage", (event, args) => {
// //   console.log("收到渲染进程的消息",  args);
// //   subWindows[0] && subWindows[0].webContents.send("receiveMessage", "我是主进程已收到消息" + args); // 响应渲染进程
// // });


// // ipcMain.on('openDialog',(event)=>{
// //   dialog.showOpenDialog({
      
// //   }).then(result=>{
// //       console.log(result);        //输出结果
// //       result.filePaths.length>0 && win.webContents.send(result);
// //   })
// // })

// ipcMain.on('openDialog', async (event:any) => {
//   // const res = await dialog.showOpenDialog(win, { title: '测试',  properties: ['openDirectory']});
//   // console.log(res);
// });

