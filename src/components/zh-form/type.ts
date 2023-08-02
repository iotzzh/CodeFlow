import { CascaderOption, CascaderProps } from 'element-plus';
import { IDatePickerType } from 'element-plus/es/components/date-picker/src/date-picker.type';
import { EpPropMergeType } from 'element-plus/es/utils';


export interface TZHformConfig {
  rules?: Object
  formLabelWidth?: string | number
  fields?: Array<TZHFromField>
  hideUnimportantFields?: boolean

  customModel?: { [x: string]: any } // 自定义额外字段
  customValidate?: (modelValue: { [x: string]: any }) => boolean // 自定义额外的校验
}

export interface TZHFromField {
  // <!--xl:1920, lg:1200, md:992,sm:768, xs:<768  -->
  span?: number // 表格的span非必填
  xl?: number
  lg?: number
  md?: number
  sm?: number
  xs?: number
  maxWidth?: string
  minWidth?: string
  type: string
  unimportant?: boolean
  label?: string
  prop?: string
  refName?: string // ref name
  defaultValue?: any // 默认值
  labelWidth?: string | number // 标签宽度
  hide?: boolean // 是否隐藏
  width?: string | number // 宽度
  placeholder?: string // 占位符
  disabled?: boolean | Function // 是否禁用
  clearable?: boolean // 是否可清除
  required?: boolean // 是否必填

  size?: EpPropMergeType<StringConstructor, '' | 'default' | 'small' | 'large', never> | undefined

  // 下拉选择/级联选择
  // options?: Array<TZHFromFieldSelectOption> | Array<TZHFromFieldCascaderOption> | Array<{ [x: string]: any }>
  options?: Array<TZHFromFieldSelectOption> | Array<CascaderOption> | Array<{ [x: string]: any }>
  defaultOptions?: Array<TZHFromFieldSelectOption> | Array<CascaderOption> | Array<{ [x: string]: any }>

  // 级联选择器的参数
  props?: CascaderProps
  // 输入框 input
  inputType?: string
  showPassword?: boolean
  suffixIcon?: any
  appendSuffixIcon?: any
  focus?: Function | string

  // 开关Switch
  activeText?: string
  inactiveText?: string
  activeValue?: any
  inactiveValue?: any

  // 下拉
  valueKey?: string
  multiple?: boolean
  remote?: boolean
  remoteMethod?: Function
  labelField?: string
  valueField?: string
  api?: string


  // 时间选择器
  timeType?: EpPropMergeType<(new (...args: any[]) => IDatePickerType & {}) | (() => IDatePickerType) | ((new (...args: any[]) => IDatePickerType & {}) | (() => IDatePickerType))[], unknown, unknown> | undefined
  timeShowFormat?: string
  timeValueFormat?: string
  // 级联选择器
  checkedNodes?: Array<any>

  // 多选框
  checkboxText?: string

  //#region 方法
  // 转换方法, 一对一转换
  convert?: Function

  // 时间转换，数组拆分，并定义格式
  convertDateTime?: Array<TZHFromFieldConvertDateTime>

  // 转换方法：一对多转换， 针对需要额外扩展的参数，例如 { a: 'a' } => { b: 'a1', c: 'a2' }
  extendedFieldMethod?: Function
  notDeleteOriginPropertyWhenUseExtendedFieldMethod?: boolean

  convertCascader?: Function
  //#endregion
}

export interface TZHFromFieldConvertDateTime {
  field: string
  format: string
}

export interface TZHFromFieldSelectOption {
  label: string
  value: any
  text?: string
}

// TODO
export interface TZHFromFieldCascaderOption {
  test: string

}

// export interface TZHFromFieldCascaderProps {
//   expandTrigger?: string
// }

export interface TObject {
  [x: string]: any
}