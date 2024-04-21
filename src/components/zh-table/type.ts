import { EpPropMergeType } from 'element-plus/es/utils';
import { TComponent } from '../type';
import { TZHFormModal } from '../zh-form-modal/type';
import { TZHFromField, TZHformConfig } from '../zh-form/type';
import { TreeNode } from 'element-plus';

export interface TZHTable {
  formConfig?: TZHTableFormConfig
  tablePanelConfig?: TZHTablePanelSetting
  tableConfig: TZHTableConfig
  pageConfig?: TZHTablePageConfig
  requestConfig?: TZHTableRequestConfig
}



//#region Request
export interface TZHTableRequestConfig {
  list?: TZHTableRequestConfigDetail
  add?: TZHTableRequestConfigDetail
  delete?: TZHTableRequestConfigDetail
  batchDelete?: TZHTableRequestConfigDetail
  update?: TZHTableRequestConfigDetail

  initialData?: boolean // 是否需要初始化数据，默认为true
}

export interface TZHTableRequestConfigDetail {
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

export interface TZHTableFormConfig extends TZHformConfig {
  hasSearchButton?: boolean // 显示搜索按钮
  hasDeleteButton?: boolean // 显示批量删除按钮
  hasExportButton?: boolean // 显示导出按钮
  hasUploadButton?: boolean // 显示上传按钮
  hasAddButton?: boolean // 显示新增按钮
  hasResetButton?: boolean // 显示重置按钮
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


export interface TZHTablePageConfig {
  sizes?: Array<number> // [10, 20, 50, 100]
  current?: number
  size?: number
  pagerCount?: number // 分页显示的数量
  total?: number
  layout?: string // 'pre,next,total'
}


export interface TZHTablePanelSetting {
  title?: string
  secondaryTitle?: string
}

export interface TZHTableConfig {
  tablePanelSetting?: TZHTablePanelSetting
  height?: string | number // 表格高度，示例：'100%', '100px', 100
  highlightCurrentRow?: boolean // 高亮选中行
  rowKey?: string // 行内唯一值，没有该值，！！无法使用checkbox！！
  hasSelection?: boolean // 是否存在checkbox列
  hasIndex?: boolean // 是否存在Index列
  columns?: Array<TZHTableColumn> // 列配置，内包含新增和编辑的列配置
  actionColumn?: TZHTableActionColumn // 操作列配置
  treeProps?: { [x: string]: any } // 树形展示配置
  defaultExpandAll?: boolean
  border?: boolean
  lazy?: boolean
  load?: (row: any, treeNode: TreeNode, resolve: (data: any[]) => void) => void
  validateLoad?: Function


  modal?: TZHTableModal // 弹窗配置

  // 事件
  rowClick?: Function // 单击事件

  // 函数注入
  onBeforeInitData?: Function // 在初始化数据之前执行
  convertTableData?: Function // 转换表格数据
}

export interface TZHTableModal extends TZHFormModal {
  customModel?: { [x: string]: any }
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
  slot?: boolean | TComponent
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
  displayRowEditActionMethod?: Function
  hasRowDeleteAction?: boolean
  displayRowDeleteActionMethod?: Function
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
  type?: EpPropMergeType<StringConstructor, '' | 'default' | 'text' | 'success' | 'warning' | 'info' | 'primary' | 'danger', unknown>
  size?: EpPropMergeType<StringConstructor, '' | 'default' | 'small' | 'large', never> | undefined
  icon?: string
  style?: any
  onClick?: Function | string
  label?: string
}

export interface TZHTableRequestConfigResult {
  success: boolean
  resCode: string
  data: any
}

export interface TObject {
  [x: string]: any
}