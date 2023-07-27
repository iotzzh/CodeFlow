import { computed, Ref, ref, nextTick } from 'vue';
import { TZHFormModal } from '../zh-form-modal/type';
import { TZHTableRequest, TZHTableRequestResult, TZHTableColumnAddEditInfo, TZHTableFromField, TZHFromFieldConvertDateTime, TZHTableSetting, TZHTableColumn, TObject } from './type';
import Table from './table';
import ZHRequest from '../zh-request';
import { TZHRequestParams } from '../zh-request/type';
import dayjs from 'dayjs';
import { TZHFormSettings } from '../zh-form/type';



export default class Modal {
  request: Ref<TZHTableRequest | undefined> | undefined;
  table: Table;
  refZHFormModal: Ref<any>;
  tableSettings: Ref<TZHTableSetting>;
  constructor(
    request: Ref<TZHTableRequest | undefined> | undefined,
    table: Table,
    refZHFormModal: Ref<any>,
    tableSettings: Ref<TZHTableSetting>) {
    this.table = table;
    this.request = request;
    this.refZHFormModal = refZHFormModal;
    this.tableSettings = tableSettings;
  }

  _getObjctWithoutFunction = (obj: TObject) => {
    const keys = Object.keys(obj);
    const newObj = {};
    keys.forEach((x: string) => {
      if (typeof obj[x] !== 'function') {
        newObj[x] = obj[x];
      }
    });
    return newObj;
  };

  formSettings = computed(() => {
    return {
      // eslint-disable-next-line no-prototype-builtins
      fields: this.table.columns.value?.filter((x: any) => x.hasOwnProperty('addEditInfo')).map((y: any) => {
        return {
          ...this._getObjctWithoutFunction(y),
          ...y.addEditInfo,
        };
      }),
      customValidate: this.tableSettings.value.modal?.customValidate,
    } as TZHFormSettings;
  });

  modal = ref({ show: false, title: '新增', loadingSubmit: false, } as TZHFormModal);

  formModel = ref({} as any);
  convertedModel = ref({} as any);

  openAddModal = () => {
    this.modal.value.type = 'add';
    // 在新增时，有些字段带有默认值
    this.refZHFormModal.value.init();
    this.modal.value.show = true;
  };


  openEditModal = (row: any) => {
    this.formModel.value = { ...row };
    this.modal.value.type = 'edit';
    this.modal.value.show = true;
  };

  close = () => {
    this.formModel.value = {};
    this.modal.value.show = false;
  };

  cancel = () => {
    this.formModel.value = {};
    this.modal.value.show = false;
  };



  getParams = () => {
    const model = this.convertedModel.value
      ? JSON.parse(JSON.stringify(this.convertedModel.value))
      : {};

    const customModel = this.tableSettings.value.modal?.customModel && JSON.parse(JSON.stringify(this.tableSettings.value.modal?.customModel));

    const params = {
      ...model,
      ...customModel,
    };

    // if (this.formSettings?.value?.convertParams) {
    //   params = this.formSettings.value?.convertParams(params);
    // }

    return params;
  };

  submit = async () => {
    // this.refZHFormModal.value.toggleLodadingSubmit(true);
    this.modal.value.loadingSubmit = true;
    // TODO: 搜索前操作，例如变换某个字段， tableSettings.onBeforeSubmit(type: 'add | update')
    const params: TZHRequestParams = {
      url: this.modal.value.type === 'add' ?
        this.request?.value?.add?.url || '' :
        this.request?.value?.update?.url || '',
      conditions: this.getParams(),
    };

    // console.log('submit', params);

    const result: TZHTableRequestResult = await ZHRequest.post(params);
    if (result.success) {
      this.close();
      this.table.initData();
    }
    await nextTick();
    this.modal.value.loadingSubmit = false;
  };
}
