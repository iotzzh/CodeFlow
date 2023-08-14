const fs = require('fs');
const path = require('path');

export const createFolder = (currentFolder: string, folderName: string) => {
    const res = fs.mkdirSync(path.join(currentFolder, folderName));
};

export const createFile = async (currentFolder: string, fileName: string, content: string) => {
    const filePath = path.join(currentFolder, fileName);
    const dirPath = path.dirname(filePath);
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }
    const res = await fs.promises.writeFile(filePath,  content);
    console.log(res);
};