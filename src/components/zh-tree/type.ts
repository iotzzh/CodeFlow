import { TZHFormModal } from '../zh-form-modal/type'; 

export interface TZHTree {
  treeConfig: TZHTreeConfig
  requestConfig?: TZHTreeRequestConfig
  formModalConfig?: TZHTreeFormModal // 弹窗配置
}

export interface TZHTreeConfig {
  hasAdd?: boolean
  hasEdit?: boolean
  hasDelete?: boolean
  hasEmptyAdd?: boolean
  hasRootAdd?: boolean
  labelDisplayMaxLength?: number
  initialData?: boolean
  checkStrictly?: boolean
  showCheckbox?: boolean
  defaultProps?: any

  nodeClick?: Function | string

}

export type TZHTreeFormModal = TZHFormModal

export interface TZHTreeRequestConfig {
  urlGet?: string
  conditionsGet?: TObject
  urlAdd?: string
  conditionsAdd?: TObject
  urlDelete?: string // 单个删除
  conditionsDelete?: TObject
  urlEdit?: string
  conditionsEdit?: TObject
  successMessage?: string
  errorMessage?: string
}


export interface TObject {
  [x:string]: any
}