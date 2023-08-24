import { rimraf, rimrafSync, native, nativeSync } from 'rimraf'

const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');



export const createFolder = (currentFolder: string, folderName: string) => {
    const res = fs.mkdirSync(path.join(currentFolder, folderName));
};

export const createFile = async (currentFolder: string, fileName: string, content: string | Object) => {
    const filePath = path.join(currentFolder, fileName);
    const dirPath = path.dirname(filePath);
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }
    const res = await fsPromises.writeFile(filePath,  typeof content === 'object' ? JSON.stringify(content) : content);
    console.log('createFile: ', res);
};

export const delteFile = async (currentFolder: string, fileName: string) => {
    const filePath = path.join(currentFolder, fileName);
    const dirPath = path.dirname(filePath);
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
    const res = await fs.unlinkSync(filePath);
    // console.log('unlinkSync: ', res);
};

export const deleteFolder = async (currentFolder: string) => {
    try {
        const res = await rimraf.sync(currentFolder)
        // console.log('unlinkSync: ', res);
        return res;
    } catch (err) {
        console.log('删除文件夹报错： ', err);
    }

};