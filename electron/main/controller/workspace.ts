import DBHelper from "../db";
import { TReturn } from "./entity";

export const add = (event, params: { [x:string]:any }) => {
    const ret = new TReturn();

    // DBHelper.

    event.returnValue = ret;
}


export default { prefix: 'workspace' };
