import  DBHelper  from "../db/index";
import { TReturn } from "./entity";

export default class baseController {
    prefix: string;
    constructor (prefix:string) {
        this.prefix = prefix;
    }

    add = async (event, params: string) => {
        const ret = new TReturn();
        try {
            const res = await DBHelper[this.prefix].add(JSON.parse(params));
            // console.log(res);
        } catch(err) {
            ret.success = false;
            ret.error = err;
        }
        event.returnValue = ret;
    };

    list = async (event, params: string | undefined) => {
        const ret = new TReturn();
        try {

            const res = await DBHelper[this.prefix].list(params ? JSON.parse(params) : {});
            ret.data.records = res;
        } catch(err) {
            ret.success = false;
            ret.error = err;
        }
        event.returnValue = ret;
    };

    update = async (event, params: string | undefined) => {
        const ret = new TReturn();
        try {
            const res = await DBHelper[this.prefix].update(JSON.parse(params));
            ret.data.records = res;
        } catch(err) {
            ret.success = false;
            ret.error = err;
        }
        event.returnValue = ret;
    };

    delete = async (event, params: string | undefined) => {
        const ret = new TReturn();
        try {
            const res = await DBHelper[this.prefix].delete(JSON.parse(params));
            ret.data.records = res;
        } catch(err) {
            ret.success = false;
            ret.error = err;
        }
        event.returnValue = ret;
    };
}

