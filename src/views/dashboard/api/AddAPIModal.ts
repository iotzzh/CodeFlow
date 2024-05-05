import { ref } from 'vue';
import { TZHFormModal } from "@/components/zh-form-modal/type";
import { ipcRenderer } from 'electron';
import { popErrorMessage } from '@/components/zh-message';
import { TZHformConfig } from '@/components/zh-form/type';
import ZHRequest from '@/components/zh-request';
import api from '@/api';
import { TZHRequestParams } from '@/components/zh-request/type';
import { TZHModal } from '@/components/zh-modal/type';
import { useApiStore } from '@/stores';


export default class AddAPIModal {
    // [x: string]: any;
    workspacePath: any;
    refresh: any;
    apiStore: any;
    constructor(workspacePath: any, refresh:any) {
        this.workspacePath = workspacePath;
        this.refresh = refresh;
        this.apiStore = useApiStore();

    };


    modalConfig = ref({
        show: false,
        width: '600px',
        title: '新建API',
        draggable: true,
        footer: {
            hasCancelButton: true,
            hasSubmitButton: true,
        },
    } as TZHModal);

    formConfig = ref({
        formLabelWidth: '110px',
        fields: [
            { label: '文件名称', prop: 'label', type: 'input', required: true, disabled: (model: any) =>  this.apiStore?.selectedRoute?.type == 'file' && !this.apiStore?.selectedRoute?.isRoot},
            { label: '文件名称(en)', prop: 'englishName', type: 'input', required: true, disabled: (model: any) =>  this.apiStore?.selectedRoute?.type == 'file' && !this.apiStore?.selectedRoute?.isRoot },
            { label: '接口名称', prop: 'apiName', type: 'input', style: {}, hide: (model:any) => this.apiStore?.selectedRoute?.type == 'file' && this.apiStore?.selectedRoute?.isRoot },
            { label: '接口名称(en)', prop: 'englishApiName', type: 'input', style: {}, hide: (model:any) => this.apiStore?.selectedRoute?.type == 'file' && this.apiStore?.selectedRoute?.isRoot },
            { label: 'url', prop: 'url', type: 'input', style: {}, hide: (model:any) => this.apiStore?.selectedRoute?.type == 'file' && this.apiStore?.selectedRoute?.isRoot },
            { label: '批量接口', prop: 'batch', type: 'switch', style: {}, hide: (model:any) => this.apiStore?.selectedRoute?.type == 'file' && !this.apiStore?.selectedRoute?.isRoot },
        ],
    } as TZHformConfig);


    model = ref({} as { [x: string]: any });

    close = () => {
        this.model.value = {};
        this.modalConfig.value.show = false;
    };

    submit = async () => {
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
        } else {
            // 添加单个接口
            if (this.modalConfig.value.data && Object.keys(this.modalConfig.value.data).length > 0) {
                const apiName = this.model.value.apiName;
                const englishApiName = this.model.value.englishApiName;
                const url = this.model.value.url;
                const oldApiList = this.modalConfig.value.data.route.api;
                content.api = oldApiList.concat([
                    {
                        label: apiName,
                        name: englishApiName,
                        url: url.padStart('/') ? url : '/' + url, 
                    }
                ]);
            } else {
                // 在根目录添加时，如果不批量添加，就添加一个查询的接口
                content.api = [
                    {
                        label: label + '列表',
                        name: 'get' + firstUpperName + 'List',
                        url: '/' + englishName + '/list', 
                    }
                ];
            }
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