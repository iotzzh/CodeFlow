import { Database } from 'sqlite3';

export default class DBHelper {
    static db: Database | null = null;
    static openDB = async () => {
        const sqlite3 = require('sqlite3').verbose();
        // 打开数据库连接
        this.db = new sqlite3.Database('./data.db', (err) => {
            if (err) console.error(err.message);
            console.log('Connected to the test database.');
        });

        // 获取当前文件夹下的所有文件, 注意：这个是自动引入的方法，但是使用后无法在具体使用时使用TS类型，
        const modules = import.meta.glob('./*.ts');
        for (const path in modules) {
            if (Object.prototype.hasOwnProperty.call(modules, path)) {
                const module: any = await modules[path]();
                if (module && module.default && typeof module.default.name === 'string') {
                    const moduleDefault = module.default;
                    this[moduleDefault.name] = new module.default(this.db);
                }
            }
        }
    };
}