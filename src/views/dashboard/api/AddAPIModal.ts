import { ref } from 'vue';
import { TZHFormModal } from "@/components/zh-form-modal/type";
import { ipcRenderer } from 'electron';
import { popErrorMessage } from '@/components/zh-message';
import { TZHformConfig } from '@/components/zh-form/type';
import ZHRequest from '@/components/zh-request';
import api from '@/api';
import { TZHRequestParams } from '@/components/zh-request/type';
import { TZHModal } from '@/components/zh-modal/type';

export default class AddAPIModal {
    // [x: string]: any;
    // constructor(setTreeData: any) {
    //     this.setTreeData = setTreeData;
    // };

    modalConfig = ref({
        show: false,
        width: '500px',
        title: '新建API',
        draggable: true,
        footer: {
            hasCancelButton: true,
            hasSubmitButton: true,
        },
    } as TZHModal);

    formConfig = ref({
        formLabelWidth: '80px',
        fields: [
            { label: '标签', prop: 'label', type: 'input', required: true },
            { label: '英文名', prop: 'english', type: 'input', required: true },
            // { label: '名称', prop: 'name', type: 'input', style: {}, hide: (model:any) => apiStore?.selectedRoute?.type !== 'api' },
            // { label: 'url', prop: 'url', type: 'input', style: {}, hide: (model:any) => apiStore?.selectedRoute?.type !== 'api' },
            { label: '批量接口', prop: 'batch', type: 'switch', style: {} },
        ],
    } as TZHformConfig);


    model = ref({} as { [x: string]: any });

    close = () => {
        this.model.value = {};
        this.modalConfig.value.show = false;
    };

    submit = async () => {
        const url = api.updateApi;
        const conditions: { [x: string]: any } = {
        };


        const params: TZHRequestParams = { url: api.AddRouter, conditions };
        const res = await ZHRequest.post(params);
        if (res.success) {
            this.close();
            // this.setTreeData();
        } else {
            popErrorMessage(res.error);
        }
    };
}