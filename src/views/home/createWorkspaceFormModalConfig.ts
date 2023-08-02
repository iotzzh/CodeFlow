import { ref } from 'vue';
import { TZHFormModal } from "@/components/zh-form-modal/type";
import { ipcRenderer } from 'electron';

export default ref({
    modalConfig: {
        show: false,
        width: '500px',
        title: '新建工作区',
        footer: {
            hasCancelButton: true,
            hasSubmitButton: true,
        }
    },
    formConfig: {
        formLabelWidth: '100px',
        fields: [
            { prop: 'name', label: '工作区名称', type: 'input', span: 24 },
            { prop: 'englishName', label: '英文名称', type: 'input', span: 24 },
            { prop: 'address', label: '工作区路径', type: 'input', span: 24, refName: 'refInput', appendSuffixIcon: 'folderOpened', clickAppendSuffixIcon: async (e:any, item:any, model:any, ref:any) => {
                if (model.address) return;
                const res = ipcRenderer.sendSync('dialog:chooseFolder');
                model.address = res && res.filePaths && res.filePaths[0];
                // ref.blur();
            }
        },
        ],
    }
} as TZHFormModal);