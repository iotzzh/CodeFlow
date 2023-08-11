const fs = require('fs');
const path = require('path');

export const createFolder = (currentFolder: string, folderName: string) => {
    const res = fs.mkdirSync(path.join(currentFolder, folderName));
};

export const createFile = async (currentFolder: string, fileName: string, content: string) => {
    const res = await fs.promises.writeFile(path.join(currentFolder, fileName),  content);
    console.log(res);
};