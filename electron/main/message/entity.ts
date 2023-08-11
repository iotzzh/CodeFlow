export class TReturn {
    success = true;
    error = '';
    data: { [x:string] : any} = { records: [] }; // data本身是对象，如果返回列表，放在data.records里面
}