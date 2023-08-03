import { Ref } from 'vue';
import { TZHformConfig } from '../zh-form/type';
import { TZHModal } from '../zh-modal/type';

export default class ZHFormModal {
    emit: any;
    refZHModal: any;
    refZHForm: any;
    formConfig: Ref<TZHformConfig | undefined>;
    modelValue: any;
    modalConfig: Ref<TZHModal>;
    constructor(params: any) {
        this.refZHModal = params.refZHModal;
        this.emit = params.emit;
        this.refZHForm = params.refZHForm;
        this.formConfig = params.formConfig;
        this.modelValue = params.modelValue;
        this.modalConfig = params.modalConfig;
    }

    initForm = () => {
        this.refZHForm.value && this.refZHForm.value.init();
    };

    setModalFormModel = (data:{[x:string]: any}) => {
        const keys = Object.keys(data);
        for (const key of keys) {
            this.modelValue.value[key] = data[key];
        }
    };

    clearFormData = () => {
        this.refZHForm.value && this.refZHForm.value.clearFormData();
    };

    open = () => {
        this.refZHModal.value.open();
    };

    opened = () => { 
        this.emit('opened'); 
    };

    close = () => {
        this.emit('close');
    };

    closed = () => {
        this.emit('closed');
        this.initForm();
    };

    cancel = () => {
        this.emit('cancel');
    };

    submit = async () => {
        if (await this.refZHForm.value.validate()) {
            this.emit('submit');
        }
    };
}