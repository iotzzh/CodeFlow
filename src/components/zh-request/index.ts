import IpcRenderRequest from './ipcRenderRequest/ipcRendererRequest';
import AxiosRequest from './axios/axiosRequest';
import Config from './config';
import { TZHRequestParams } from './type';

export default class ZHRequest {
  useAxios: boolean;
  instance?: AxiosRequest | IpcRenderRequest;
  useIpcRender: boolean;
  constructor() {
    this.useAxios = Config.useAxios;
    this.useIpcRender = Config.useIpcRender;

    if (this.useAxios) {
      this.instance = new AxiosRequest();
    } else if (this.useIpcRender) {
      this.instance = new IpcRenderRequest();
    }
  }

  static async get(params: TZHRequestParams) {
    const useAxios = Config.useAxios;
    const useIpcRender = Config.useIpcRender;
    if (useAxios) {
      const request = new AxiosRequest();
      return await request.get(params);
    } else if (useIpcRender) {
      const request = new IpcRenderRequest();
      // return await request.get(params);
    }
  }

  static async post(params: TZHRequestParams) {
    const useAxios = Config.useAxios;
    const useIpcRender = Config.useIpcRender;
    if (useAxios) {
      const request = new AxiosRequest();
      // console.log('请求参数: ', params);
      return await request.post(params);
    } else if (useIpcRender) {
      const request = new IpcRenderRequest();
      // return await request.post(params);
    }
  }

  static put() {
    console.log();
  }

  static delete() {
    console.log();
  }

  get = () => { console.log(); };
  post = () => { console.log(); };
  put = () => { console.log(); };
  delete = () => { console.log(); };
  cancel = () => { console.log(); };
}