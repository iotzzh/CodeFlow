import dayjs from 'dayjs';
import { ref, Ref } from 'vue';
import { TZHformConfig, TZHFromField, TZHFromFieldConvertDateTime } from './type';

type TParams = {
  emit: (event: 'update:modelValue' | 'update:convertedModel', ...args: any[]) => void
  formConfig: Ref<TZHformConfig>
  modelValue: Ref<{ [x: string]: any }>
  convertedModel: Ref<{ [x: string]: any } | undefined> | undefined
  refForm: any
}

export default class Form {
  emit: (event: 'update:modelValue' | 'update:convertedModel', ...args: any[]) => void;
  refForm: any;
  formConfig: Ref<TZHformConfig>;
  hideUnimportantFields: Ref<boolean | undefined>;
  modelValue: Ref<{ [x: string]: any }>;
  convertedModel: Ref<{ [x: string]: any } | undefined> | undefined;
  constructor(params: TParams) {
    this.emit = params.emit;
    this.refForm = params.refForm;
    this.formConfig = params.formConfig;
    this.hideUnimportantFields = ref(params.formConfig.value.hideUnimportantFields);
    this.modelValue = params.modelValue;
    this.convertedModel = params.convertedModel;
  }

  hasConvertedModel = (): boolean => {
    return !!this.convertedModel && !!this.convertedModel.value;
  };

  init = () => {
    if (
      !this.formConfig?.value?.fields ||
      this.formConfig.value?.fields.length === 0 ||
      !this.modelValue?.value
    )
      return;
    for (const field of this.formConfig.value.fields) {
      if (typeof field === 'object' && Object.prototype.hasOwnProperty.call(field, 'defaultValue')) {
        this.modelValue.value[field.prop || ''] = field.defaultValue;
      }
    }
    this.setConvertModel(this.modelValue.value);
  };

  clearFormData = () => {
    if (!this.modelValue.value) return;

    for (const key of Object.keys(this.modelValue.value)) {
      delete this.modelValue.value[key];
    }

    if (this.convertedModel && this.convertedModel.value) {

      for (const key of Object.keys(this.convertedModel.value)) {
        delete this.convertedModel.value[key];
      }
    }
  };

  validate = async () => {
    if (!this.refForm.value) return false;
    if (this.formConfig?.value?.customValidate && !this.formConfig?.value?.customValidate(this.modelValue?.value)) return false;
    const result = await this.refForm.value.validate((valid: any) => {
      return valid;
    });
    return result;
  };

  //#region model 转换方法
  // 针对需要转换数据的情况：field: a -> b
  useConvert = (model: { [key: string]: any }, convertedModel: { [key: string]: any }, fields: TZHFromField[]) => {
    if (!convertedModel) return;
    const needConverTFromFields = fields.filter((x) => x.convert);
    for (let i = 0; i < needConverTFromFields.length; i++) {
      const method: Function | string | undefined = needConverTFromFields[i].convert;
      const prop: any = needConverTFromFields[i]?.prop;
      if (prop && method) {
        if (typeof method === 'string') {
          const func = new Function('fieldValue, modelValue', method);
          return func(model[prop], model);
        } else {
          convertedModel[prop] = method(model[prop], model);
        }
      }
    }
  };

  useConvertDateTime = (model: { [key: string]: any }, convertedModel: { [key: string]: any }, fields: TZHFromField[]) => {
    const needConvertDateTimeFields: TZHFromField[] = fields.filter((x) => x.convertDateTime);
    for (let i = 0; i < needConvertDateTimeFields.length; i++) {
      const prop: any = needConvertDateTimeFields[i]?.prop;
      if (!prop) continue;
      const value = model[prop];
      if (value) {
        for (let j = 0; j < value.length; j++) {
          const convertDateTimeArr = needConvertDateTimeFields[i]
            .convertDateTime as Array<TZHFromFieldConvertDateTime>;
          const field = convertDateTimeArr[j].field;
          const format = convertDateTimeArr[j].format;
          convertedModel[field] = dayjs(value[j]).format(format);
        }
      } else {
        const convertDateTimeArr = needConvertDateTimeFields[i]
          .convertDateTime as Array<TZHFromFieldConvertDateTime>;
        for (let j = 0; j < convertDateTimeArr.length; j++) {
          const field = convertDateTimeArr[j].field;
          convertedModel[field] = undefined;
        }
      }
    }
  };

  useExtendedFieldMethod = (model: any, convertedModel: { [key: string]: any }, fields: TZHFromField[]) => {
    // 针对需要额外扩展的参数，例如 { a: 'a' } => { b: 'a1', c: 'a2' }
    const needExtendFields: TZHFromField[] = fields.filter(
      (x) => x.extendedFieldMethod
    );
    for (let i = 0; i < needExtendFields.length; i++) {
      const method: Function | undefined = needExtendFields[i].extendedFieldMethod;
      const prop: any = needExtendFields[i].prop;
      if (!method || !prop) return;
      const result = method(model[prop], model);

      result && Array.isArray(result) && result.forEach(
        (element: { property: string | number, value: any }) => {
          convertedModel[element.property] = element.value;
        }
      );
      // delete convertedModel[needExtendFields[i].prop];
    }
  };

  useConvertCascader = (model: any, convertedModel: { [key: string]: any }, fields: TZHFromField[]) => {
    const needConvertCascaderFields: TZHFromField[] = fields.filter((x) => x.convertCascader);
    for (let i = 0; i < needConvertCascaderFields.length; i++) {
      const method: Function | undefined = needConvertCascaderFields[i].convertCascader;
      const prop: any = needConvertCascaderFields[i].prop;
      if (!method || !prop) return;
      const result = method(model[prop], model, needConvertCascaderFields[i]);

      result && Array.isArray(result) && result.forEach(
        (element: { property: string | number, value: any }) => {
          convertedModel[element.property] = element.value;
        }
      );
    }
  };

  setConvertModel = async (newVal: any) => {
    if (!this.hasConvertedModel()) return;
    const convertedModelValue: any = this.convertedModel!.value;
    const keys = Object.keys(newVal);
    for (let i = 0; i < keys.length; i++) {
      convertedModelValue[keys[i]] = newVal[keys[i]];
    }

    this.useConvert(newVal, convertedModelValue, this.formConfig.value.fields || []);
    this.useConvertDateTime(newVal, convertedModelValue, this.formConfig.value.fields || []);
    this.useExtendedFieldMethod(newVal, convertedModelValue, this.formConfig.value.fields || []);
    this.useConvertCascader(newVal, convertedModelValue, this.formConfig.value.fields || []);

    this.emit('update:convertedModel', this.convertedModel?.value);
  };
  //#endregion

  //#region 事件
  changeCascader = (itemRefs: any, refName: any, formConfig: any) => {
    // 将级联选择器选中的节点存储起来
    const refValue = itemRefs && refName && itemRefs[refName];
    if (!refValue) return;
    const filed: any = formConfig.fields && formConfig.fields.find((x: any) => x.refName === refName);
    if (!filed) return;
    filed.checkedNodes = refValue.getCheckedNodes();
  };
  //#endregion
}
