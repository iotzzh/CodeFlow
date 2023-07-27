// import { ipcRenderer } from 'electron';
// import { TZHRequestParams } from '../type';

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
  //   get = async (params: TZHRequestParams) => {
  //       let result: any = {};
  //       try {
  //         result = ipcRenderer.sendSync(
  //           params.url,
  //           JSON.parse(JSON.stringify(params.conditions))
  //         );
  //         if (result.resCode === '00') result.success = true;
  //       } catch (error) {
  //         result = { success: false };
  //       }
  //       return result;
  //   };

  //   post = async (params: TZHRequestParams) => {
  //     let result: any = {};
  //     try {
  //       result = ipcRenderer.sendSync(
  //         params.url,
  //         JSON.parse(JSON.stringify(params.conditions))
  //       );
  //       if (result.resCode === '00') result.success = true;
  //     } catch (error) {
  //       result = { success: false };
  //     }
  //     return result;
  // };
}