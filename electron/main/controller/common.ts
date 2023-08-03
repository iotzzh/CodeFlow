import DBHelper from "../db";
import { TReturn } from "./entity";

export default class baseController {
    add = async (event, params: string) => {
        const ret = new TReturn();
        try {
            const res = await DBHelper['DBWorkspaceHelper'].add(JSON.parse(params));
        } catch(err) {
            ret.success = false;
            ret.error = err;
        }
        event.returnValue = ret;
    };

    list = async (event, params: string | undefined) => {
        const ret = new TReturn();
        try {
            const res = await DBHelper['DBWorkspaceHelper'].list(params && Object.keys(params).length > 0 ? JSON.parse(params) : null);
            ret.data.records = [];
        } catch(err) {
            ret.success = false;
            ret.error = err;
        }
        event.returnValue = ret;
    };
}

