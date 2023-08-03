import api from '@/api/index';
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
                label: 'label',
            },
        },
        requestConfig: {
            urlGet: api.getWorkspaceList,
        },
        formModalConfig: {
            modalConfig: {
                show: false,
                width: '300px',
                closeInModal: true,
                footer: {
                    hasCancelButton: true,
                    hasSubmitButton: true,
                },
            },
            formConfig: {
            //     fields: [
            //         { prop: 'test', label: '测试', type: 'input', span: 12, },
            //         { prop: 'test1', label: '测试1', type: 'select', span: 12, convert: 'return 111', defaultOptions: [{ label: '测试1', value: '测试1' }, { label: '测试2', value: '测试2' }] }
            //     ]
            },
            model: {},
            convertedModel: {},
        },
    });


    
}