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
            const rows = await DBHelper.all(`select * from ${this.tableName}`);
            const cameizeData = humps.camelizeKeys(rows);
            return cameizeData;
        } catch(err) {
            console.log(err);
        }
    };

    list = async (params:any) => {
        try {
            if (params && Object.keys(params).length > 0) {
                const keys = Object.keys(params).map((x:any) => humps.decamelize(x));
                const newValue = [];
                keys.forEach((x:string) => {
                    if (x !== 'size' && x !== 'current' && params[humps.camelize(x)] !== undefined) newValue.push(`${x} = '${params[humps.camelize(x)]}'`);
                });

                let sql = `select * from ${this.tableName}`;
                if (newValue.join(' and ')) sql += ` where ${ newValue.join(' and ') }`;
                sql += ` limit ${params.size || 0} offset ${((params.current || 1) - 1) * params.size}`;

                const rows = await DBHelper.all(sql);
                return humps.camelizeKeys(rows);
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
            const { v4: uuidv4 } = require('uuid');
            value.id = uuidv4();
            const kys = Object.keys(value).map((x:any) => humps.decamelize(x));
            const values = Object.values(value);
            const sql = `insert into ${this.tableName} (${kys.join(',') + ', create_time'}) values (${values.map(y => `'${y}'`).join(',') + ',' + '\'' + dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss') + '\''} )`;
            const res = await DBHelper.run(sql);
            return res;
        } catch(err) {
            console.log(err);
        }
    };

    delete = async (value:{ [x:string]:any }) => {
        try {
            if ('ids' in value && Object.keys(value).length === 1) {
                const sql = `delete from ${this.tableName} where id in ('${value.ids.join(',')}')`;
                const res = await DBHelper.run(sql);
                return res;
            } else {
                const res = await DBHelper.run(`delete from ${this.tableName} where id = ${value.id}`);
                return res;
            }

        } catch(err) {
            console.log(err);
        }
    };

    update = async (value:{[x:string]:any}) => {
        try {
            const keys = Object.keys(value).map((x:any) => humps.decamelize(x));
            const newValue = [];
            keys.forEach((x:string) => {
                value[humps.camelize(x)] !== undefined && newValue.push(`${x} = '${value[humps.camelize(x)]}'`);
            });
            newValue.push(`update_time = '${dayjs().format('YYYY-MM-DD HH:mm:ss')}'`);
            const sql = `update ${this.tableName} set ${newValue.join(',')} where id = '${value.id}'`;
            const res = await DBHelper.run(sql);
            return res;
        } catch(err) {
            console.log(err);
        }
    };
}
