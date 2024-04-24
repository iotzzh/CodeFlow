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
    workspacePath: any;
    refresh: any;
    constructor(workspacePath: any, refresh:any) {
        this.workspacePath = workspacePath;
        this.refresh = refresh;
    };

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
            { label: '英文名', prop: 'englishName', type: 'input', required: true },
            { label: '名称', prop: 'name', type: 'input', style: {}, hide: (model:any) => apiStore?.selectedRoute?.type !== 'api' },
            { label: 'url', prop: 'url', type: 'input', style: {}, hide: (model:any) => apiStore?.selectedRoute?.type !== 'api' },
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
        const label = this.model.value.label;
        const englishName = this.model.value.englishName;
        const firstUpperName = englishName[0].toUpperCase() + englishName.substr(1);

        const address  = this.workspacePath.value;
        const fileName = englishName + '.json';
        const content: { [x:string]:any} = {
            label,
        };
        if (this.model.value.batch) {
            content.api = [
                {
                    label: label + '列表',
                    name: 'get' + firstUpperName + 'List',
                    url: '/' + englishName + '/list', 
                },
                {
                    label: '新增' + label,
                    name: 'add' + firstUpperName,
                    url: '/' + englishName + '/add', 
                },
                {
                    label: '删除' + label,
                    name: 'delete' + firstUpperName,
                    url: '/' + englishName + '/delete', 
                },
                {
                    label: '修改' + label,
                    name: 'update' + firstUpperName,
                    url: '/' + englishName + '/update', 
                },
            ];
        }

        const conditions: { [x: string]: any } = {
            address,
            fileName,
            content,
        };


        const params: TZHRequestParams = { url: api.updateApi, conditions };
        const res = await ZHRequest.post(params);
        if (res.success) {
            this.close();
            this.refresh();
        } else {
            popErrorMessage(res.error);
        }
    };
}