import { ipcMain } from "electron";

const modules = import.meta.glob('./*.ts');

export const addMessageListener = async () => {
    for (const path in modules) {
        if (Object.prototype.hasOwnProperty.call(modules, path)) {
            const module: any = await modules[path]();
            const keys = Object.keys(module);
            keys.forEach((x: any) => {
                try {
                    if (module.default?.name && typeof module[x] === 'function') {
                        ipcMain.on(`${module.default.name + ':' + x}`, module[x])
                    } else {
                        ipcMain.on(x, module[x]);
                    }

                } catch (err) {
                    console.log(err);
                }
            });
        }
    }
};

// for (const path in modules) {
//     if (Object.prototype.hasOwnProperty.call(modules, path)) {
//         const module:any = await modules[path]();
//         const subApi = {};
//         module.default.api.forEach(element => {
//             if (element.name in api || element.name in subApi) console.error(`api 定义异常：${element.name}重复定义，请换个名字`);

//             const prefix = getPrefix(module.default, element);
//             subApi[element.name] = '/' + prefix + element.url;
//         });

//         api = { ...api, ...subApi };
//     }
// }

// export default mess;