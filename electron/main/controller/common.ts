import DBHelper from "../db";
import { TReturn } from "./entity";

export default class baseController {
    add = async (event, params: { [x:string]:any }) => {
        const ret = new TReturn();
        const res = await DBHelper['DBWorkspaceHelper'].add(params);
        event.returnValue = ret;
    };
}

