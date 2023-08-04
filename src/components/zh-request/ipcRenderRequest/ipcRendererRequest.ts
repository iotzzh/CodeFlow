// import { ipcRenderer } from 'electron';
// import { TZHRequestParams } from '../type';

import { ipcRenderer } from "electron";

// // 判断模块是否存在的函数
// async function isModuleAvailable(moduleName:string) {
//   try {
//     await import(moduleName);
//     return true;
//   } catch (error) {
//     return false;
//   }
// }

// // 使用示例
// if (await isModuleAvailable('electron')) {
//   // 模块存在，进行引用操作
//   import('electron').then((myModule) => {
//     // 使用 myModule
//   }).catch((error) => {
//     // 引用模块失败
//   });
// } else {
//   // 模块不存在
// }

export default class {
    get = async (params: any) => {
        let result: any = {};
        try {
          result = ipcRenderer.sendSync(
            params.url,
            params.conditions ? JSON.parse(JSON.stringify(params.conditions)) : {}
          );
        } catch (error) {
          result = { success: false };
        }
        return result;
    };

    post = async (params: any) => {
      let result: any = {};
      try {
        result = ipcRenderer.sendSync(
          params.url,
          params.conditions ? JSON.stringify(params.conditions) : ''
        );
      } catch (error) {
        result = { success: false, error };
      }
      return result;
  };
}