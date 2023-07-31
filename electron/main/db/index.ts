export default class DBHelper {
    static db = null;
    static openDB = async () => {
        const sqlite3 = require('sqlite3').verbose();
        // 打开数据库连接
        this.db = new sqlite3.Database('./data.db', (err) => {
            if (err) console.error(err.message);
            console.log('Connected to the test database.');
        });
    };
}