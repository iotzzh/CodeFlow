import { popErrorMessage, popSuccessMessage } from '@/components/zh-message';
import { TZHRequestParams } from '../type';
import request from './axios';

export default class {
    controller: AbortController;
    constructor() {
        this.controller = new AbortController();
    }

    get = async (params: TZHRequestParams) => {
        let result: any = {};
        try {
            result = await request({ url: params.url, method: 'get', params: params.conditions, timeout: params.timeout, signal: this.controller.signal });
            if (result.success) {
                params.successMessage && popSuccessMessage(params.successMessage);
            } else {
                params.errorMessage && popErrorMessage(params.errorMessage + (params.notNeedBackEndErrorMessage ? '' : `: ${ result.errMsg || result.errorMsg || result.resMsg || result.error }`));
            }
        } catch (error) {
            params.errorMessage && popErrorMessage(params.errorMessage + (params.notNeedBackEndErrorMessage ? '' : `: ${error}`));
            result = { success: false };
        }
        return result;
    };

    post = async (params: TZHRequestParams) => {
        let result: any = {};
        params.config = params.config ? { ...params.config } : {};
        try {
            result = await request({ url: params.url, method: 'post', data: params.conditions, timeout: params.timeout, signal: this.controller.signal, ...params.config  });
            if (result.success) {
                params.successMessage && popSuccessMessage(params.successMessage);
            } else {
                params.errorMessage && popErrorMessage(params.errorMessage + (params.notNeedBackEndErrorMessage ? '' : `: ${ result.errMsg || result.errorMsg || result.resMsg || result.error }`));
            }
        } catch (error) {
            params.errorMessage && popErrorMessage(params.errorMessage + (params.notNeedBackEndErrorMessage ? '' : `: ${error}`));
            result = { success: false };
        }
        return result;
    };

    cancel = async () => {
        this.controller.abort();
    };
}