export default class DBCommonHelper {
    db: any;
    tableName: string;

    constructor(db:any, tableName: string) { 
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

    add = async (value:{[x:string]:any}) => {
        try {
            const kys = Object.keys(value);
            const values = Object.values(value);
            const res = await this.db.run(`insert into ${this.tableName} (${kys.join(',')}) values (${values.join(',')})`);
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
            const res = await this.db.run(`update ${this.tableName} set ${newValue.join(',')} where id = ${value.id})`);
            return res;
        } catch(err) {
            console.log(err);
        }
    };
}