import { TReturn } from "./entity";
import { createFolder, createFile } from '../utils/file';

const path = require('path'); //解析需要遍历的文件夹
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');



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
            res.data.records.push(JSON.parse(fileData));
        }
        event.returnValue = res;
    } catch(err) {
        event.returnValue = { success: false, error: err } as TReturn;
    }
};

// const  findRootNode(nodes:any, childNode:any) {
//     if (!childNode.parentID) {
//         return childNode;
//     } else {
//         const parentNode = nodes.find(node => node.id === childNode.parentID);
//         if (parentNode) {
//             return findRootNode(parentNode);
//         } else {
//             return null; // 没有找到对应的父节点，可能出现数据问题
//         }
//     }
// }

// 添加路由，添加路由时，直接跟随页面的添加，可选择模板，或者是空模板
export const AddRouter = async (event, route, parentRoute) => {
    try {
        const res = new TReturn();
        const routePath = path.join(`E:\\tworspace\\zh-admin-vue\\`, 'src\\router\\routes');
        const pagePath = path.join(`E:\\tworspace\\zh-admin-vue\\`, 'src\\views');
        const id = uuidv4();
        const isFloder = route.menuType === 1; // 1是目录， 2是菜单
        const parentId = route.parentId;
        route.id = id;
        if (!parentId) { // 顶级菜单
            createFile(routePath, route.routeCode + '.json', JSON.stringify(route));    
        } else { // 子菜单

            if(isFloder) {
    
            } else {
                
            }
        }
    
        event.returnValue = res;
    } catch(err) {
        console.log(err);
    }
   
};

// 更新路由文件,注意：当更新路由名的时候，注意修改文件夹名称
export const updateRouter = () => {};

// 删除路由，当删除父层时，子层也被删除
export const deleteRouter = () => {};


//#endregion