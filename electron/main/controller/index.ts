import { ipcMain } from "electron";

export default class Controller {
    static init = async () => {
        // 获取当前文件夹下的所有文件, 注意：这个是自动引入的方法，但是使用后无法在具体使用时使用TS类型，
        const modules = import.meta.glob('./*.ts');
        for (const path in modules) {
            if (!Object.prototype.hasOwnProperty.call(modules, path)) continue;

            const module:any = await  modules[path]();
            if (!module || !module.default || typeof module.default !== 'function' || !module.default.prefix) continue;
            
            const controller = this[module.default.prefix] = new module.default();

            const keys = Object.keys(controller);

            keys.forEach((x: any) => {
                if (module.default.prefix && typeof controller[x] === 'function') {
                    ipcMain.on(`${'api/' + module.default.prefix + '/' + x}`, controller[x])
                } else {
                    typeof controller[x] === 'function' && ipcMain.on(x, controller[x]);
                }
            });
        }
    };
}