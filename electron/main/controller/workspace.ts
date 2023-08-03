import DBHelper from "../db";
import { TReturn } from "./entity";

export const add = async (event, params: { [x:string]:any }) => {
    const ret = new TReturn();

    const res = await DBHelper['DBWorkspaceHelper'].add(params);

    event.returnValue = ret;
}


export default { prefix: 'workspace' };
