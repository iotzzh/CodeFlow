import { Ref, ref } from 'vue';
import { TZHFormModal } from "@/components/zh-form-modal/type";
import { ipcRenderer } from 'electron';
import { RefSymbol } from '@vue/reactivity';
import { popErrorMessage } from '@/components/zh-message';
import { TZHformConfig } from '@/components/zh-form/type';
import ZHRequest from '@/components/zh-request';
import api from '@/api';
import { TZHRequestParams } from '@/components/zh-request/type';
import { TZHTable } from '@/components/zh-table/type';

export default class Project {
    position: string; // 目前有两个值：dashboard, appManage
    tableConfig: Ref<TZHTable>;
    constructor (position:string) {
        this.position = position;
        this.tableConfig = this.setTableConfig(position);
    }

    setTableConfig = (position:string) => {
        const isManage = position === 'appManage';
        return ref({
            formConfig: !isManage ? undefined :  {
                hasAddButton: true,
                hasSearchButton: false,
                hasDeleteButton: true,
                hasUploadButton: false,
                hasExportButton: false,
                hasResetButton: false,
                customModel: {},
                formLabelWidth: '70px',
                fields: [
                    {
                        label: '项目名称', type: 'input', prop: 'projectName', maxWidth: '300px'
                    },
                ],
            },
    
            tableConfig: {
                hasIndex: isManage,
                hasSelection: isManage,
                rowKey: 'id',
                modal: {
                    modalConfig: {
                        title: '',
                        mainTitle: '应用程序',
                        footer: {
                            hasCancelButton: true,
                            hasSubmitButton: true,
                        },
                        onBeforeSubmit: 'console.log("onbeforeSubmit");',
                        onAfterSubmit: 'console.log("onaftersubmit");'
                    },
                    formConfig: {
                        formLabelWidth: '90px',
                    },
                },
                columns: [
                    {
                        label: '项目名称',
                        prop: 'projectName',
                        allowCellEdit: false,
                        minWidth: '100px',
                        addEditInfo: {
                            type: 'input',
                            addSort: 1,
                            defaultValue: '',
                            placeholder: '请输入',
                            span: 24,
                            required: true,
                        }
                    },
                    {
                        label: '地址', prop: 'address',
                        minWidth: '80px',
                        addEditInfo: {
                            type: 'input',
                            refName: 'refInput', appendSuffixIcon: 'folderOpened',
                            clickAppendSuffixIcon: async (e: any, item: any, model: any, ref: any) => {
                                const res = ipcRenderer.sendSync('dialog:chooseFolder');
                                model.address = res && res.filePaths && res.filePaths[0];
                            },
                            defaultValue: null, addSort: 2, placeholder: '请选择',
                            span: 24,
                            required: false,
                        }
                    },
                ],
                actionColumn: {
                    label: '操作',
                    width: isManage ? '180px' : '120px',
                    hasRowDeleteAction: isManage,
                    hasRowEditAction: isManage,
                    buttons: [
                        { label: '进入', type: 'primary', onClick: () => {    ipcRenderer.send('window:create', {
                            name: 'dashboard',
                            route: 'dashboard',
                        });} },
                        { label: '部署', type: 'success' },
                    ],
                },
            },
            requestConfig: {
                list: { url: api.getProjectList, successMessage: '查询成功', errorMessage: '查询失败' },
                add: { url: api.addProject, successMessage: '新增成功', errorMessage: '新增失败' },
                update: { url: api.updateProject, successMessage: '更新成功', errorMessage: '更新失败' },
                delete: { url: api.deleteProject, successMessage: '删除成功', errorMessage: '删除失败' },
            },
            // pageConfig: {},
        } as TZHTable);
    };

}