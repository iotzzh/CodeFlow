const path = require('path'); //解析需要遍历的文件夹
const fs = require('fs');


export default { prefix: 'file' };

//#region API文件操作
export const getApiList = async (event, address) => {
    try {
        const res = [];
        const filePath = path.join(`E:\\tworspace\\zh-admin-vue\\src\\api`);
        const files = fs.readdirSync(filePath);
        for (let i = 0; i < files.length; i++) {
            const filedir = path.join(filePath, files[i]);
            if (!files[i].endsWith('.json')) continue;
            const fileData = await fs.readFileSync(filedir, { encoding: 'utf8' });
            res.push({ name: files[i], data: JSON.parse(fileData) });
        }
        event.returnValue = res;
    } catch (err) {
        console.log(err);
    }
}

//#endregion


//#region 页面文件操作

//#endregion