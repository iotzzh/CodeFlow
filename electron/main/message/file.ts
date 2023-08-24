import { TReturn } from "./entity";
import { createFolder, createFile, delteFile, deleteFolder } from '../utils/file';
import TreeHelper from "../utils/treeHelper";
import { prettierCode } from '../utils/cmd';


const path = require('path'); //解析需要遍历的文件夹
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');



export default { prefix: 'file' };

//#region API文件操作
export const getApiList = async (event, address) => {
    try {
        const res = new TReturn();
        // const filePath = path.join(`E:\\tworspace\\zh-admin-vue\\src\\api`);
        const filePath = path.join(address, `src\\api`);
        const files = fs.readdirSync(filePath);
        for (let i = 0; i < files.length; i++) {
            const filedir = path.join(filePath, files[i]);
            if (!files[i].endsWith('.json')) continue;
            const fileData = await fs.readFileSync(filedir, { encoding: 'utf8' });
            res.data.records.push({ name: files[i], data: JSON.parse(fileData) });
        }
        event.returnValue = res;
    } catch (err) {
        event.returnValue = { success: false, error: err } as TReturn;
    }
}

export const updateApi = async (event, params = '{}') => {
    const { address, fileName, content } = JSON.parse(params);

    const res = new TReturn();
    if(!address || !fileName) return res;
    try {
        const filePath = path.join(address, `src\\api`);
        await createFile(filePath, fileName, content);
        event.returnValue = res;
    } catch (err) {
        event.returnValue = { success: false, error: err } as TReturn;
    } finally {
        prettierCode(address);
    }
    event.returnValue = res;
}

export const deleteApiFile = async (event, params = '{}') => {
    const { address, fileName } = JSON.parse(params);

    const res = new TReturn();
    if(!address || !fileName) return res;
    try {
        const filePath = path.join(address, `src\\api`);
        await delteFile(filePath, fileName);
        event.returnValue = res;
    } catch (err) {
        event.returnValue = { success: false, error: err } as TReturn;
    } finally {
        prettierCode(address);
    }
    event.returnValue = res;
}
//#endregion


//#region 页面文件操作（页面文件数据，路由数据）
// 获取路由文件
export const getRouter = async (event, address) => {
    try {
        const res = new TReturn();
        const filePath = path.join(`E:\\tworspace\\zh-admin-vue\\src\\router\\routes`);
        const files = fs.readdirSync(filePath);
        for (let i = 0; i < files.length; i++) {
            const filedir = path.join(filePath, files[i]);
            if (!files[i].endsWith('.json')) continue;
            const fileData = await fs.readFileSync(filedir, { encoding: 'utf8' });
            fileData && res.data.records.push(JSON.parse(fileData));
        }
        event.returnValue = res;
    } catch (err) {
        event.returnValue = { success: false, error: err } as TReturn;
    }
};

// 添加路由，添加路由时，直接跟随页面的添加，可选择模板，或者是空模板
export const AddRouter = async (event, params) => {
    try {
        const route = JSON.parse(params);
        const { address } = route;
        const res = new TReturn();
        const routePath = path.join(address, 'src\\router\\routes');
        const pagePath = path.join(address, 'src\\views');
        const id = uuidv4();
        const isFloder = route.menuType === 1; // 1是目录， 2是菜单
        route.id = id;
        if (!route.parent) { // 顶级菜单
            await createFile(routePath, route.routeCode + '.json', JSON.stringify(route));
        } else { // 子菜单

            const parentRoute = route.parent;
            // 读取该文件
            const fileName = parentRoute.url.split('/')[1];
            const fileDataString = await fs.readFileSync(path.join(routePath, fileName + '.json'), { encoding: 'utf8' });
            const fileData = JSON.parse(fileDataString);
            const item = TreeHelper.getItemByIdInTree(parentRoute.id, [fileData]);
            if (!item.children) item.children = [];
            delete route.parent;
            item.children.push(route);

            await createFile(routePath, fileName + '.json', JSON.stringify(fileData));
        }

        if (!isFloder) {
            const template = await fs.readFileSync(path.join(address, 'src\\template\\basic.vue'), { encoding: 'utf8' });
            await createFile(pagePath, route.url + '/index.vue', template);
        }

        res.data.route = route;
        event.returnValue = res;

        prettierCode(address);
    } catch (err) {
        event.returnValue = { success: false, error: err } as TReturn;
    }

};

// 更新路由文件,注意：当更新路由名的时候，注意修改文件夹名称
export const updateRouter = () => { };

// 删除路由，当删除父层时，子层也被删除
export const deleteRouter = async (event, params = '{}') => {
    const res = new TReturn();
    try {
        const { address, route } = JSON.parse(params);
        const routePath = path.join(address, 'src\\router\\routes');
        const pagePath = path.join(address, 'src\\views');
        
        const fileName = route.url.split('/')[1];
        
        // 路由操作：
        // 如果路由与文件名相同，直接删除
        if (route.routeCode === fileName) {
            await delteFile(routePath, route.routeCode + '.json');
        } else {
            // 其他情况，移出数据，重新保存
            const fileDataString = await fs.readFileSync(path.join(routePath, fileName + '.json'), { encoding: 'utf8' });
            const fileData = JSON.parse(fileDataString);
            let item:any = TreeHelper.getItemParentByIdInTree(route.id, [fileData]);
            item.children = item.children.filter((x:any) => x.id !== route.id);
            await createFile(routePath, fileName + '.json', JSON.stringify(fileData));
        }

        // 界面文件操作：
        await deleteFolder( path.join(pagePath, route.menuType === 1 ? route.filePath : route.filePath.replace(/\/index$/,"")));
        
        prettierCode(address);
        event.returnValue = res;
    } catch (err) {
        event.returnValue = { success: false, error: err } as TReturn;
    }
};

//#endregion


//#region vite.config.json文件配置
export const getProxy = async (event, address) => {
    try {
        const res = new TReturn();
        const filePath = path.join(address, 'vite.config.json');
        const fileData = await fs.readFileSync(filePath, { encoding: 'utf8' });
        const proxyObj = JSON.parse(fileData).server.proxy;
        const keys = Object.keys(proxyObj);
        const proxyes = [];
        for (let i = 0; i < keys.length; i++) {
            proxyes.push({ name: keys[i], value: proxyObj[keys[i]] });
        }
        res.data = proxyes;
        event.returnValue = res;
    } catch (err) {
        event.returnValue = { success: false, error: err } as TReturn;
    }
};

export const updateProxy = async (event, address, newProxyArr) => {
    try {
        const res = new TReturn();
        const filePath = path.join(address, 'vite.config.json');
        const fileData = await fs.readFileSync(filePath, { encoding: 'utf8' });
        const fileDataObj = JSON.parse(fileData);
        let proxyObj = fileDataObj.server.proxy;

        const newProxyes = {};
        const newProxy = JSON.parse(newProxyArr);
        for (let i = 0; i < newProxy.length; i++) {
            newProxyes[newProxy[i].name] = newProxy[i].value;
        }
        fileDataObj.server.proxy = newProxyes;
        console.log('fileDataObj: ', fileDataObj);
        createFile(address, 'vite.config.json', JSON.stringify(fileDataObj));
        event.returnValue = res;
    } catch (err) {
        event.returnValue = { success: false, error: err } as TReturn;
    } finally {
        prettierCode(address);
    }
};

//#endregion