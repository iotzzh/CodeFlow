import dayjs from 'dayjs';
import humps from 'humps';
import { Database } from 'sqlite3';
import DBHelper from '.';

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
            const cameizeData = humps.camelizeKeys(rows);
            return cameizeData;
        } catch(err) {
            console.log(err);
        }
    };

    list = async (params:any) => {
        try {
            if (params) {
                const rows = await DBHelper.all(`select * from ${this.tableName} limit ${params.size || 0} offset ${((params.current || 1) - 1) * params.size}`);
                return rows;
            } else {
                const rows = await DBHelper.all(`select * from ${this.tableName}`);
                const cameizeData = humps.camelizeKeys(rows);
                return cameizeData;
            }
        } catch(err) {
            console.log(err);
        }
    };

    add = async (value:{ [x:string]: any }) => {
        try {
            const kys = Object.keys(value).map((x:any) => humps.decamelize(x));
            const values = Object.values(value);
            const sql = `insert into ${this.tableName} (${kys.join(',') + ', create_time'}) values (${values.map(y => `'${y}'`).join(',') + ',' + '\'' + dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss') + '\''} )`;
            const res = await this.db.run(sql);
            return res;
        } catch(err) {
            console.log(err);
        }
    };

    delete = async (value:{ [x:string]:any }) => {
        try {
            const res = await this.db.run(`delete from ${this.tableName} where id = ${value.id}`);
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
