import { ref } from 'vue';
import { TZHFormModal } from "@/components/zh-form-modal/type";
import { ipcRenderer } from 'electron';
import { RefSymbol } from '@vue/reactivity';
import { popErrorMessage } from '@/components/zh-message';

export default class CreateWorkspaceFormModal {
    modalConfig = ref({
        show: false,
        width: '500px',
        title: '新建工作区',
        footer: {
            hasCancelButton: true,
            hasSubmitButton: true,
        },
    });

    formConfig = ref({
        formLabelWidth: '100px',
        fields: [
            { prop: 'name', label: '工作区名称', type: 'input', span: 24 },
            { prop: 'englishName', label: '英文名称', type: 'input', span: 24 },
            {
                prop: 'address', label: '工作区路径', type: 'input', span: 24, refName: 'refInput', appendSuffixIcon: 'folderOpened',
                clickAppendSuffixIcon: async (e: any, item: any, model: any, ref: any) => {
                    const res = ipcRenderer.sendSync('dialog:chooseFolder');
                    model.address = res && res.filePaths && res.filePaths[0];
                }
            },
        ],
    });


    model = ref({});

    close = () => {
        this.model.value = {};
        this.modalConfig.value.show = false;
    };

    submit = async () => {
        const res = await ipcRenderer.sendSync('api:workspace:add', JSON.stringify(this.model.value));
        if (res.success) {
            this.close();
        } else {
            popErrorMessage(res.error);
        }
    };
}