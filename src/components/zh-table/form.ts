import { Ref, ref } from 'vue';
import {  TZHTableFromField } from './type';
import _ from 'lodash';


export default class Form {
  page: Ref<any>;
  refZHForm: any;
  request: any | undefined;
  formSettings: any | undefined;
  constructor(
    page: Ref<any>,
    request: any | undefined,
    formSettings: any | undefined,
    refZHForm: any
  ) {
    this.page = page;
    this.request = request;
    this.formSettings = formSettings;
    this.refZHForm = refZHForm;
  }

  formModel = ref({} as any);
  convertedFormModel = ref({} as any);

  getSearchParams = () => {
    const model = this.convertedFormModel.value
      ? JSON.parse(JSON.stringify(this.convertedFormModel.value))
      : {};

    const customModel = this.formSettings?.customModel && JSON.parse(JSON.stringify(this.formSettings?.customModel));

    let params = {
      current: this.page.value.current,
      size: this.page.value.size,
      ...this.request?.list?.conditions,
      ...model,
      ...customModel,
    };

    if (this.formSettings?.convertParams) {
      params = this.formSettings?.convertParams(params);
    }

    return params;
  };

  getSearchFormModel = () => {
    return this.formModel.value;
  };

  setSearchFormModel = (data:{[x:string]: any}) => {
    const keys = Object.keys(data);
    for (const key of keys) {
      this.formModel.value[key] = data[key];
    }
  };

  getSearchFormParams = () => {
    return this.getSearchParams();
  };

  _convertSlotName = (prop: string | undefined): string => {
    return 'zh-form-' + (prop || '');
  };

  _getNotChangeTriggerSearchFields = () => {
    return this.formSettings?.fields?.filter((x: TZHTableFromField) => x.notChangeTriggerSearch) || [];
  };

  _compareNeedTriggerSearchFieldsIsEqual = (newVal: { [x: string]: any }, oldVal: { [x: string]: any }) => {
    const notChangeTriggerSearchFields = this._getNotChangeTriggerSearchFields();
    const oldValNeedTriggerSearchFields = oldVal;
    const newValNeedTriggerSearchFields = newVal;
    for (let i = 0; i < notChangeTriggerSearchFields.length; i++) {
      const prop:any = notChangeTriggerSearchFields[i].prop;
      delete oldValNeedTriggerSearchFields[prop];
      delete newValNeedTriggerSearchFields[prop];
    }

    return _.isEqual(oldValNeedTriggerSearchFields, newValNeedTriggerSearchFields);
  };

    //#region 上传功能
    fileList = ref([] as any);
    handlePreview = () => {};
    handleRemove = () => {};
    beforeRemove = () => {};
    handleExceed = () => {};
    //#endregion
}
