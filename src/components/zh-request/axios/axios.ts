import { popErrorMessage } from '@/components/zh-message';
// import { router } from '@/router';
import storage from '@/utils/storage';
import axios from 'axios';

const request = axios.create({
    timeout: 10000 // 默认超时10s
});

request.interceptors.request.use(
    config => {
        // const token: any = storage.getToken();
        const timestamp = new Date().getTime(); //时间戳           
        if (config.headers) {
            // config.headers['token'] = token;
            config.headers['Cache-Control'] = 'no-cache';
        }

        if (config.method === 'post') {
            config.params = {
                ts: timestamp,
            };
            if (config.data && config.data.toString() !== '[object FormData]' && !Array.isArray(config.data)) {
                const newData:any = {};
                  for (const key in config.data) {
                    if (config.data[key] !== '' && config.data[key] !== null) {
                      newData[key] = config.data[key];
                    }
                  }
                  config.data = newData;
              }
        } else if (config.method === 'get') {
            config.params = {
                ts: timestamp,
                ...config.params
            };
        }
        return config;
    },
    error => {
        console.log(error);
        return Promise.reject(error);
    }
);

request.interceptors.response.use(
    response => {
        if (response.status === 200) {

            return response.data;            // if (response.data.errorCode === 'C10' || response.data.errCode === 'C10' || response.data.errorCode === 'C11' || response.data.errCode === 'C11'
            // || response.data.errorCode === 'E996' || response.data.errCode === 'E996') {
            //     popErrorMessage('Token已过期，请重新登录');
            //     sessionStorage.clear();
            //     localStorage.clear();
            //     // router && router.push('/');
            //     // location.reload();
            // } else {
            //     return response.data;
            // }
        } else {
            Promise.reject(response);
        }
    },
    error => {
        console.log(error);
        return Promise.reject(error);
    }
);
export default request;