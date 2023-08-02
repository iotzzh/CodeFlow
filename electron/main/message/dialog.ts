import { dialog } from "electron";

export default { prefix: 'dialog' };

export const chooseFolder = async (event) => {
    const res = await dialog.showOpenDialog(globalThis.mainWindow, { title: '请选择文件夹',  properties: ['openDirectory']});
    event.returnValue = res;
}