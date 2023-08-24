import { ref } from 'vue';
import { TZHFormModal } from "@/components/zh-form-modal/type";
import { ipcRenderer } from 'electron';
import { popErrorMessage } from '@/components/zh-message';
import { TZHformConfig } from '@/components/zh-form/type';
import ZHRequest from '@/components/zh-request';
import api from '@/api';
import { TZHRequestParams } from '@/components/zh-request/type';
import { TZHModal } from '@/components/zh-modal/type';

export default class PageAddEditModal {
    [x: string]: any;
    constructor(setTreeData: any, workspacePath:any) {
        this.setTreeData = setTreeData;
        this.workspacePath = workspacePath;
    };

    modalConfig = ref({
        show: false,
        width: '500px',
        title: '新建导航',
        footer: {
            hasCancelButton: true,
            hasSubmitButton: true,
        },
    } as TZHModal);

    formConfig = ref({
        formLabelWidth: '80px',
        fields: [
            { prop: 'routeName', label: '名称', type: 'input', span: 24, required: true, },
            { prop: 'routeCode', label: '英文名称', type: 'input', span: 24, required: true, },
            {
                prop: 'menuType', label: '类型', type: 'select', span: 24, required: true,
                defaultOptions: [{ label: '菜单', value: 2 }, { label: '目录', value: 1 }]
            },
            {
                prop: 'test', label: '页面模板', type: 'select', span: 24, defaultOptions: [
                    { label: '空模板', value: 'template-null' },
                    { label: '基础模板', value: 'template-basic' }
                ], hide: (modelValue: any) => modelValue?.menuType !== 2
            },
            { prop: 'sortNo', label: '排序', type: 'input', inputType: 'number', span: 24, required: true, },
            { prop: 'icon', label: 'icon', type: 'input', span: 24, required: true, },
            { prop: 'description', label: '备注', type: 'input', inputType: 'textarea', span: 24, required: false, },

        ],
    } as TZHformConfig);


    model = ref({} as { [x: string]: any });

    close = () => {
        this.model.value = {};
        this.modalConfig.value.show = false;
    };

    submit = async () => {
        const parent = this.modalConfig.value.data;
        const url = parent ? parent.url + '/' + this.model.value.routeCode : '/' + this.model.value.routeCode;
        const conditions: { [x: string]: any } = {
            ...this.model.value,
            url,
            address: this.workspacePath,
        };
        if (parent) conditions.parent = parent;
        if (this.model.value.menuType === 2) {
            conditions.filePath = url + '/index';
        } else {
            conditions.filePath = url;
        }
        const params: TZHRequestParams = { url: api.AddRouter, conditions };
        const res = await ZHRequest.post(params);
        if (res.success) {
            this.close();
            this.setTreeData();
        } else {
            popErrorMessage(res.error);
        }
    };
}