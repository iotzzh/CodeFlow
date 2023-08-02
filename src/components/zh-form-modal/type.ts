import { TZHformConfig, TZHFromField } from '../zh-form/type';
import { TZHModal } from '../zh-modal/type';

export interface TZHFormModal {
  modalConfig: TZHModal
  formConfig: TZHformConfig
}

export interface TZHModalFromField extends TZHFromField {
  // 表格使用表单时，默认值变化时就搜索数据，个别字段变化不需要搜索，使用该值：notChangeTriggerSearch = 'true'
  notChangeTriggerSearch?: boolean
}