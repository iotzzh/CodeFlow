export default class DBHelper {
    static db = null;
    static openDB = async () => {
        const sqlite3 = require('sqlite3').verbose();
        // 打开数据库连接
        this.db = new sqlite3.Database('./data.db', (err) => {
            if (err) console.error(err.message);
            console.log('Connected to the test database.');
        });

        // 获取当前文件夹下的所有文件
        const modules = import.meta.glob('./*.ts');
        for (const path in modules) {
            if (Object.prototype.hasOwnProperty.call(modules, path)) {
                const module: any = await modules[path]();
                this[module.default.name] = new module.default(this.db);
            }
        }
    };

}