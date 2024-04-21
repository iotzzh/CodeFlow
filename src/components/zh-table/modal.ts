import { computed, Ref, ref, nextTick } from 'vue';
import { TZHFormModal } from '../zh-form-modal/type';
import { TObject, TZHTableConfig, TZHTableRequestConfig, TZHTableRequestConfigResult } from './type';
import ZHRequest from '../zh-request';
import { TZHRequestParams } from '../zh-request/type';
import { TZHformConfig } from '../zh-form/type';
import { TZHModal } from '../zh-modal/type';



export default class Modal {
  refZHFormModal: Ref<any>;
  emit: any;
  request: TZHTableRequestConfig | undefined;
  tableSettings: TZHTableConfig;
  globalTable: any;
  constructor(
    request: TZHTableRequestConfig | undefined,
    refZHFormModal: Ref<any>,
    tableSettings: TZHTableConfig,
    emit: any,
    globalTable: any,
  ) {
    this.request = request;
    this.refZHFormModal = refZHFormModal;
    this.tableSettings = tableSettings;
    this.emit = emit;
    this.globalTable = globalTable;
  }

  columnFunctionFields = ['convert'];
  _getObjctWithoutFunction = (obj: TObject) => {
    const keys = Object.keys(obj);
    const newObj: { [x: string]: any } = {};
    keys.forEach((x: string) => {
      if (typeof obj[x] !== 'function' && !this.columnFunctionFields.find((y: string) => y === x)) {
        newObj[x] = obj[x];
      }
    });
    return newObj;
  };

  formSettings = computed(() => {
    return {
      // eslint-disable-next-line no-prototype-builtins
      fields: this.tableSettings.columns?.filter((x: any) => x.hasOwnProperty('addEditInfo')).map((y: any) => {
        return {
          ...this._getObjctWithoutFunction(y),
          ...y.addEditInfo,
        };
      }).sort((m: any, n: any) => m.addSort - n.addSort > 0 ? 1 : -1),
      customValidate: this.tableSettings.modal?.formConfig && this.tableSettings.modal?.formConfig.customValidate,
      ... this.tableSettings.modal?.formConfig
    } as TZHformConfig;
  });

  modal = ref({ show: false, title: '新增', loadingSubmit: false, footer: {} } as TZHModal);

  formModel = ref({} as any);
  convertedModel = ref({} as any);

  openAddModalData = ref({} as any);
  openAddModal = (data: any = undefined) => {
    this.modal.value.show = true;
    this.modal.value.type = 'add';
    this.modal.value.title = this.tableSettings.modal?.modalConfig?.mainTitle ? '新增' + this.tableSettings.modal.modalConfig.mainTitle : '新增';
    this.modal.value = { ...this.tableSettings.modal?.modalConfig, ...this.modal.value };
    // 在新增时，有些字段带有默认值
    this.refZHFormModal.value.initForm();
    this.openAddModalData.value = data;
  };

  executeOpenAddModal = (modal: any, data: any) => {
    this.modal.value.show = true;
    this.modal.value.type = 'add';
    this.modal.value = { ...this.modal.value, ...this.tableSettings.modal };
    this.modal.value.title = modal.title;
    this.formModel.value = { ...modal };
    this.openAddModalData.value = data;
  };

  openEditModalData = ref({} as any);
  openEditModal = async (row: any) => {
    this.modal.value.type = 'edit';
    this.modal.value.title = this.tableSettings.modal?.modalConfig?.mainTitle ? '编辑' + this.tableSettings.modal?.modalConfig?.mainTitle : '编辑';
    this.modal.value.show = true;
    await nextTick();
    this.formModel.value = { ...row };
    this.openEditModalData.value = { ...row };
    this.modal.value = { ...this.tableSettings.modal?.modalConfig, ...this.modal.value };
  };

  // 使用两种方式调用opened方法，一种是向外抛，一种是往里传递执行，可能是函数，可能是字符串
  opened = () => {
    const result = {
      modal: this.modal.value,
      formModel: this.formModel.value,
      openAddModalData: this.openAddModalData.value,
      openEditModalData: this.openEditModalData.value
    };
    if (this.tableSettings.modal?.modalConfig.onOpened) {
      if (typeof this.tableSettings.modal?.modalConfig.onOpened === 'string') {
        (new Function('params', this.tableSettings.modal?.modalConfig.onOpened))(result);
      } else {
        this.tableSettings.modal?.modalConfig.onOpened(result);
      }
    } else {
      this.emit('opened', result);
    }
  };

  setModalFormModel = (data: { [x: string]: any }) => {
    const keys = Object.keys(data);
    for (const key of keys) {
      this.formModel.value[key] = data[key];
    }
  };

  close = () => {
    this.formModel.value = {};
    this.convertedModel.value = {};
    this.modal.value.show = false;

    this.refZHFormModal.value.clearFormData();
  };

  cancel = () => {
    this.formModel.value = {};
    this.convertedModel.value = {};
    this.modal.value.show = false;
    this.refZHFormModal.value.clearFormData();
  };

  getParams = () => {
    const convertedModel = this.convertedModel.value
      ? JSON.parse(JSON.stringify(this.convertedModel.value))
      : {};

    const originConditions = (this.modal.value.type === 'add' ? this.request?.add?.conditions : this.request?.update?.conditions) || {};

    const customModel = this.tableSettings.modal?.formConfig?.customModel && JSON.parse(JSON.stringify(this.tableSettings.modal?.formConfig?.customModel));

    const params = {
      ...convertedModel,
      ...customModel,
      ...originConditions
    };

    // if (this.formSettings?.value?.convertParams) {
    //   params = this.formSettings.value?.convertParams(params);
    // }

    return params;
  };

  submit = async () => {
    // this.refZHFormModal.value.toggleLodadingSubmit(true);
    this.modal.value.loadingSubmit = true;
    const conditions = this.getParams();

    if (this.tableSettings?.modal?.modalConfig.onBeforeSubmit) {
      if (typeof this.tableSettings.modal.modalConfig.onBeforeSubmit === 'string') {
        const AsyncFunction = Object.getPrototypeOf(async function () { /* */ }).constructor;
        await new AsyncFunction('params', this.tableSettings.modal.modalConfig.onBeforeSubmit)({ modal: this.modal.value, conditions, });
      } else {
        await this.tableSettings.modal.modalConfig.onBeforeSubmit({ modal: this.modal.value, conditions, });
      }
    }

    const params: TZHRequestParams = {
      url: this.modal.value.type === 'add' ?
        this.request?.add?.url || '' :
        this.request?.update?.url || '',
      conditions,
      successMessage: this.modal.value.type === 'add' ? this.request?.add?.successMessage : this.request?.update?.successMessage,
      errorMessage: this.modal.value.type === 'add' ? this.request?.add?.errorMessage : this.request?.update?.errorMessage,
    };

    // console.log('submit', params);

    const result: TZHTableRequestConfigResult = await ZHRequest.post(params);
    if (result.success) {
      this.close();
      this.globalTable.value.table.debounceInitData();
    }
    await nextTick();
    this.modal.value.loadingSubmit = false;
    this.refZHFormModal.value.clearFormData();

    if (this.tableSettings?.modal?.modalConfig.onAfterSubmit) {
      if (typeof this.tableSettings.modal.modalConfig.onAfterSubmit === 'string') {
        (new Function('params', this.tableSettings.modal.modalConfig.onAfterSubmit))({ modal: this.modal.value, conditions, result });
      } else {
        this.tableSettings.modal.modalConfig.onAfterSubmit({ modal: this.modal.value, conditions, result });
      }
    }

  };
}
