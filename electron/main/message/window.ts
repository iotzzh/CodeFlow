import WindowHelper from "../utils/windowHelper";

export default { prefix: 'window' };

export const min  = (event, id) => {
    console.log(id);
};

export const create = (event, config: { [x:string]:any }) => {
    if (!globalThis.childWindow) globalThis.childWindow = {};
    globalThis.childWindow[config.name] = WindowHelper.createWindow(config);
    globalThis.mainWindow.minimize();
}