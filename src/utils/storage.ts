/**
 * 该文件统一管理整站的storage管理，包括sessionStorage/localStorage
 */
export default class storage {
    //#region 清除所有storage
    static clearAllStorage = function () {
        localStorage.clear();
        sessionStorage.clear();
    };
    //#endregion

    //#region session storage
    // 登录设备是否是手机端
    static setIsMobile = function (data: boolean) {
        localStorage.setItem('isMobile', JSON.stringify(data));
    };

    static getIsMobile = function () {
        const data = localStorage.getItem('isMobile');
        if (data) return JSON.parse(data);
        else return false;
    };


    // token存取
    static setToken = function (token: string) {
        sessionStorage.setItem('token', token);
    };

    static getToken = function () {
        return sessionStorage.getItem('token');
    }; 
}