export interface TZHModal {
  refName?: string // 便于调用modal内方法
  show?: boolean // 是否展示
  width?: string // 弹窗宽度
  loadingSubmit?: boolean // 提交按钮是否处于loading状态
  loadingPage?: boolean // 弹窗是否处于loading状态
  bodyHeight?: string | number // 
  title?: string // 标题
  mainTitle?: string // 主标题，用于外部扩展使用，例如`新增${mainTitle}`
  data?: any // 暂存数据
  type?: any
  top?: string
  fullscreen?: boolean
  customClass?: string
  destroyOnClose?: boolean
  closeInModal?: boolean
  showClose?: boolean

  footer?: TZHModalFooter

  onBeforeSubmit?: Function | string
  onAfterSubmit?: Function | string

  // 通过字符串创建slot内容
  conmponentName?: string
  template?: string
  methods?: Array<TZHModalMethod>

  onSubmit?: Function | string
  onCancel?: Function | string
  onClose?: Function | string
  onOpened?: Function | string
}

export interface TZHModalMethod {
  name: string
  prop?: string
  body: string
}

export interface TZHModalFooter {
  hasCancelButton?: boolean
  hasSubmitButton?: boolean
}