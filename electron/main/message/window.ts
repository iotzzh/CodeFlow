import WindowHelper from "../utils/windowHelper";

export default { prefix: 'window' };

export const create = (event, config: { [x:string]:any }) => {
    if (!globalThis.childWindow) globalThis.childWindow = {};
    globalThis.childWindow[config.name] = WindowHelper.createWindow(config);
    globalThis.mainWindow.minimize();
}

export const min  = (event, name) => globalThis.childWindow[name].minimize();

export const max  = (event, name) => {
    if (globalThis.childWindow[name].isMaximized()) {
        globalThis.childWindow[name].unmaximize();
    } else {
        globalThis.childWindow[name].maximize();
    }
};

export const close  = (event, name) => {
    globalThis.childWindow[name].close();
    delete globalThis.childWindow[name];
};