import dayjs from 'dayjs';
import humps from 'humps';
import { Database } from 'sqlite3';

export default class DBCommonHelper {
    db: Database;
    tableName: string;

    constructor(db:Database, tableName: string) { 
        this.db = db;
        this.tableName = tableName; 
    }

    listAll = async () => {
        try {
            const rows = await this.db.all(`select * from ${this.tableName}`);
            return rows;
        } catch(err) {
            console.log(err);
        }
    };

    list = async (size: number, current: number) => {
        try {
            const rows = await this.db.all(`select * from ${this.tableName} limit ${size} offset ${(current - 1) * size}`);
            return rows;
        } catch(err) {
            console.log(err);
        }
    };

    add = async (value:string) => {
        try {
            const params = JSON.parse(value);
            const kys = Object.keys(params).map((x:any) => humps.decamelize(x));
            const values = Object.values(params);
            const sql = `insert into ${this.tableName} (${kys.join(',') + ', create_time'}) values (${values.join(',') + ',' + dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss')})`;
            const res = await this.db.run(sql);
            return res;
        } catch(err) {
            console.log(err);
        }
    };

    delete = async (id:string) => {
        try {
            const res = await this.db.run(`delete from ${this.tableName} where id = ${id})`);
            return res;
        } catch(err) {
            console.log(err);
        }
    };

    update = async (value:{id: string, [x:string]:any}) => {
        try {
            const keys = Object.keys(value);
            const newValue = [];
            keys.forEach((x:string) => {
                newValue.push(`${x} = ${value[x]}`);
            });
            newValue.push(`update_time = ${dayjs().format('YYYY-MM-DD HH:mm:ss')}`);
            const res = await this.db.run(`update ${this.tableName} set ${newValue.join(',')} where id = ${value.id})`);
            return res;
        } catch(err) {
            console.log(err);
        }
    };
}
