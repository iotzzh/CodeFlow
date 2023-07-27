import { Ref, ref } from 'vue';
import { TZHModal } from './type';

export class ZHModal {
    emit: (event: 'close' | 'closed' | 'submit' | 'cancel' | 'open' | 'opened', ...args: any[]) => void;
    modal: Ref<TZHModal>;
    fullscreen: Ref<boolean>;
    constructor(modal: Ref<TZHModal>, emit: (event: 'close' | 'closed' | 'submit' | 'cancel' | 'open' | 'opened', ...args: any[]) => void) {
        this.modal = modal;
        this.emit = emit;
        this.fullscreen = ref(!!modal?.value?.fullscreen || false);
    }

    open = (data:any = {}) => {
        this.emit('open'); 
        this.modal.value.show = true;
        this.modal.value.data = data;
    };

    opened = () => { 
        this.emit('opened'); 
    };

    close = () => {
        this.emit('close');
        if (this.modal.value.closeInModal)  this.modal.value.show = false;
    };

    closed = () => {
        this.emit('closed');
    };

    private executeOnBeforeSubmit = () => {
        if (!this.modal.value.onBeforeSubmit) return;
        if (typeof this.modal.value.onBeforeSubmit === 'string')
            (new Function('params', this.modal.value.onBeforeSubmit))(this.modal.value);
        else
            this.modal.value.onBeforeSubmit(this.modal.value);
    };

    submit = async () => {
        this.executeOnBeforeSubmit();
        this.emit('submit');
    };

    cancel = () => {
        this.emit('cancel');
    };

    toggleFullScreen = () => {
        this.fullscreen.value = !this.fullscreen.value;
    };

}