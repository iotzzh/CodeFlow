import dayjs from 'dayjs';
import { Ref, ref } from 'vue';
import { TZHTablePage, TZHTableRequest, TZHTableForm, TZHTableFromField, TZHFromFieldConvertDateTime } from './type';
import _ from 'lodash';


export default class Form {
  page: Ref<TZHTablePage>;
  request: Ref<TZHTableRequest | undefined> | undefined;
  formSettings: Ref<TZHTableForm | undefined> | undefined;
  refZHForm: any;
  constructor(
    page: Ref<TZHTablePage>,
    request: Ref<TZHTableRequest | undefined> | undefined,
    formSettings: Ref<TZHTableForm | undefined> | undefined,
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

    const customModel = this.formSettings?.value?.customModel && JSON.parse(JSON.stringify(this.formSettings?.value?.customModel));

    let params = {
      current: this.page.value.current,
      size: this.page.value.size,
      ...this.request?.value?.list?.conditions,
      ...model,
      ...customModel,
    };

    if (this.formSettings?.value?.convertParams) {
      params = this.formSettings.value?.convertParams(params);
    }

    return params;
  };

  getSearchFormModel = () => {
    return this.formModel.value;
  };

  getSearchFormParams = () => {
    return this.getSearchParams();
  };

  _convertSlotName = (prop: string): string => {
    return 'zh-form-' + prop;
  };

  _getNotChangeTriggerSearchFields = () => {
    return this.formSettings?.value?.fields?.filter((x: TZHTableFromField) => x.notChangeTriggerSearch) || [];
  };

  _compareNeedTriggerSearchFieldsIsEqual = (newVal: { [x: string]: any }, oldVal: { [x: string]: any }) => {
    const notChangeTriggerSearchFields = this._getNotChangeTriggerSearchFields();
    const oldValNeedTriggerSearchFields = oldVal;
    const newValNeedTriggerSearchFields = newVal;
    for (let i = 0; i < notChangeTriggerSearchFields.length; i++) {
      delete oldValNeedTriggerSearchFields[notChangeTriggerSearchFields[i].prop];
      delete newValNeedTriggerSearchFields[notChangeTriggerSearchFields[i].prop];
    }

    return _.isEqual(oldValNeedTriggerSearchFields, newValNeedTriggerSearchFields);
  };
}
