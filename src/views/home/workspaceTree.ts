import api from '@/api/index';
import { ipcRenderer } from 'electron';
import { ref } from 'vue';

export default class WorkspaceTree {
    config = ref({
        treeConfig: {
            hasAdd: false,
            hasEdit: true,
            hasDelete: true,
            hasEmptyAdd: true,
            hasRootAdd: false,
            labelDisplayMaxLength: 50,
            initialData: true,
            checkStrictly: true,
            showCheckbox: false,
            defaultProps: {
                label: 'workspaceName',
            },
        },
        requestConfig: {
            urlGet: api.getWorkspaceList,
            urlAdd: api.addWorkspace,
            urlDelete: api.deleteWorkspace,
            urlEdit: api.updateWorkspace,
        },
        formModalConfig: {
            modalConfig: {
                show: false,
                width: '500px',
                mainTitle: '工作区',
                closeInModal: true,
                footer: {
                    hasCancelButton: true,
                    hasSubmitButton: true,
                },
            },
            formConfig: {
                formLabelWidth: '100px',
                fields: [
                    { prop: 'workspaceName', label: '工作区名称', type: 'input', span: 24, required: true, },
                    { prop: 'englishName', label: '英文名称', type: 'input', span: 24, required: true, },
                    {
                        prop: 'address', label: '工作区路径', type: 'input', span: 24, 
                        required: true,
                        refName: 'refInput', appendSuffixIcon: 'folderOpened',
                        clickAppendSuffixIcon: async (e: any, item: any, model: any, ref: any) => {
                            const res = ipcRenderer.sendSync('dialog:chooseFolder');
                            model.address = res && res.filePaths && res.filePaths[0];
                        }
                    },
                ]
            },
            model: {},
            convertedModel: {},
        },
    });


    
}