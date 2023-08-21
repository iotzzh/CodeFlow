import { TReturn } from "./entity";
import { createFolder, createFile } from '../utils/file';
import TreeHelper from "../utils/treeHelper";
import { prettierCode } from '../utils/cmd';


const path = require('path'); //解析需要遍历的文件夹
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');



export default { prefix: 'file' };

//#region API文件操作
export const getApiList = async (event, address) => {
    try {
        const res = [];
        // const filePath = path.join(`E:\\tworspace\\zh-admin-vue\\src\\api`);
        const filePath = path.join(address, `src\\api`);
        const files = fs.readdirSync(filePath);
        for (let i = 0; i < files.length; i++) {
            const filedir = path.join(filePath, files[i]);
            if (!files[i].endsWith('.json') || files[i] === 'index.json' ) continue;
            const fileData = await fs.readFileSync(filedir, { encoding: 'utf8' });
            res.push({ name: files[i], data: JSON.parse(fileData) });
        }
        event.returnValue = res;
    } catch (err) {
        console.log(err);
    }
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
        const res = new TReturn();
        const routePath = path.join(`E:\\tworspace\\zh-admin-vue\\`, 'src\\router\\routes');
        const pagePath = path.join(`E:\\tworspace\\zh-admin-vue\\`, 'src\\views');
        const id = uuidv4();
        const isFloder = route.menuType === 1; // 1是目录， 2是菜单
        route.id = id;
        if (!route.parent) { // 顶级菜单
            createFile(routePath, route.routeCode + '.json', JSON.stringify(route));
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

            createFile(routePath, fileName + '.json', JSON.stringify(fileData));
        }

        if (!isFloder) {
            createFile(pagePath, route.url + '/index.vue', `<template>${route.routeName}</template>`);
        }

        res.data.route = route;
        event.returnValue = res;
        prettierCode('E:\\tworspace\\zh-admin-vue\\');
    } catch (err) {
        console.log(err);
    }

};

// 更新路由文件,注意：当更新路由名的时候，注意修改文件夹名称
export const updateRouter = () => { };

// 删除路由，当删除父层时，子层也被删除
export const deleteRouter = () => { };

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
    } catch(err) {
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
    } catch(err) {
        event.returnValue = { success: false, error: err } as TReturn;
    } finally {
        prettierCode(address);
    }
};
//#endregion