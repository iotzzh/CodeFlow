import { TZHFromField, TZHFormSettings } from '../zh-form/type';
//#region Request
export interface TZHTableRequest {
  list?: TZHTableRequestDetail
  add?: TZHTableRequestDetail
  delete?: TZHTableRequestDetail
  batchDelete?: TZHTableRequestDetail
  update?: TZHTableRequestDetail

  initialData?: boolean // 是否需要初始化数据，默认为true
}

export interface  TZHTableRequestDetail {
  url?: string
  conditions?: TObject
  successMessage?: string
  errorMessage?: string
}

//#endregion

export interface TZHTableFromField extends TZHFromField {
  // 表格使用表单时，默认值变化时就搜索数据，个别字段变化不需要搜索，使用该值：notChangeTriggerSearch = 'true'
  notChangeTriggerSearch?: boolean

  // 转换方法, 一对一转换
  convert?: Function

  // 时间转换，数组拆分，并定义格式
  convertDateTime?: Array<TZHFromFieldConvertDateTime>

  // 转换方法：一对多转换， 针对需要额外扩展的参数，例如 { a: 'a' } => { b: 'a1', c: 'a2' }
  extendedFieldMethod?: Function
  notDeleteOriginProperty?: boolean
}

export interface TZHFromFieldConvertDateTime {
  field: string
  format: string
}

export interface TZHTableForm extends TZHFormSettings {
  hasSearchButton?: boolean // 显示搜索按钮
  hasDeleteButton?: boolean // 显示批量删除按钮
  hasExportButton?: boolean // 显示导出按钮
  hasUploadButton?: boolean // 显示上传按钮
  hasAddButton?: boolean // 显示新增按钮
  hasResetButton?: boolean // 显示重置按钮
  // customModel?: { [x: string]: any } // 搜索框扩展字段绑定的model
  convertParams?: Function // 在搜索前进行一次
  fields?: Array<TZHTableFromField> // 重写fields
  buttons?: Array<TZHTableFormButtons> // 扩展搜索按钮
}

// 扩展搜索按钮
export interface TZHTableFormButtons {
  label: string
  style?: string | { [x: string]: string | number }
  method?: Function
  icon?: any
}


export interface TZHTablePageSetting {
  sizes?: Array<number> // [10, 20, 50, 100]
  current?: number
  size?: number
  pagerCount?: number // 分页显示的数量
  total?: number
  layout?: string // 'pre,next,total'
}

export interface TZHTableSetting {
  height?: string | number // 表格高度，示例：'100%', '100px', 100
  highlightCurrentRow?: boolean // 高亮选中行
  rowKey?: string // 行内唯一值，没有该值，！！无法使用checkbox！！
  hasSelection?: boolean // 是否存在checkbox列
  hasIndex?: boolean // 是否存在Index列
  columns?: Array<TZHTableColumn> // 列配置，内包含新增和编辑的列配置
  actionColumn?: TZHTableActionColumn // 操作列配置

  modal?: TZHTableModal // 弹窗配置

  // 事件
  rowClick?: Function // 单击事件

  // 函数注入
  onBeforeInitData?: Function // 在初始化数据之前执行
}

export interface TZHTableModal extends TZHFormSettings {
  customModel: {[x:string]: any}
}

export interface TZHTableColumn {
  allowCellEdit?: boolean
  width?: number | string
  minWidth?: number | string
  align?: string
  label?: string
  prop?: string
  fixed?: boolean | string
  sortable?: boolean
  className?: string
  convert?: Function
  format?: string
  useSlot?: boolean
  nullValue?: any

  addEditInfo?: TZHTableColumnAddEditInfo // 字段在新增/编辑/显示中的配置
}

// 表格弹窗设置
export interface TZHTableColumnAddEditInfo extends TZHFromField {
  addSort?: number // 新增时排序，可小数
  editSort?: number // 编辑时排序，可小数，一般只需要新增时排序，编辑排序填写时，在编辑时覆盖新增排序
  // 转换方法, 一对一转换
  convert?: Function

  // 时间转换，数组拆分，并定义格式
  convertDateTime?: Array<TZHFromFieldConvertDateTime>

  // 转换方法：一对多转换， 针对需要额外扩展的参数，例如 { a: 'a' } => { b: 'a1', c: 'a2' }
  extendedFieldMethod?: Function
  notDeleteOriginProperty?: boolean
}

// 表格操作列
export interface TZHTableActionColumn {
  hasRowEditAction?: boolean
  hasRowDeleteAction?: boolean
  fixed?: string
  width?: string | number
  minWidth?: string
  label?: string
  align?: string
  buttons?: Array<TZHTableActionColumnButton>
}

export interface TZHTableActionColumnButton {
  displayMethod?: Function
  hide?: boolean
  type?: string
  size?: string
  icon?: string
  style?: any
  onClick?: Function
  label?: string
}

export interface TZHTableRequestResult {
  success: boolean
  resCode: string
  data: any
}

export interface TZHTablePage {
  total: number
  size: number
  current: number
}

export interface TObject {
  [x: string]: any
}