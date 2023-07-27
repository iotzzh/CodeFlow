import { computed, Ref, ref, nextTick } from 'vue';
import { TZHTablePage, TZHTableRequest, TZHTableRequestResult, TZHTableSetting } from './type';
import Form from './form';
import { isMessageConfirm, popErrorMessage, popSuccessMessage } from '../zh-message';
import { TZHRequestParams } from '../zh-request/type';
import ZHRequest from '../zh-request';
import { debounce, throttle } from 'lodash';

export default class Table {
  refTable: any;
  request: Ref<TZHTableRequest | undefined> | undefined;
  pageData: any;
  form: Form;
  tableSettings: Ref<TZHTableSetting>;
  constructor(
    tableSettings: Ref<TZHTableSetting>,
    refTable: any,
    request: Ref<TZHTableRequest | undefined> | undefined,
    form: Form,
    pageData: Ref<TZHTablePage>
  ) {
    this.tableSettings = tableSettings;
    this.refTable = refTable;
    this.request = request;
    this.pageData = pageData;
    this.form = form;
  }

  data = ref([] as any);
  loading = ref(false);

  columns = computed(() => {
    return this.tableSettings.value.columns?.filter((x: any) => !x.notDisplay);
  });

  onBeforeInitData = async () => {
    const method: Function = this.tableSettings.value.onBeforeInitData || new Function();
    await method();
  };

  initData = async (propParams: Object | null = null, initPage = true, isScroll = false) => {
    this.onBeforeInitData();
    this.loading.value = true;
    // 参数
    if (initPage) this.pageData.value.current = 1;
    const params = propParams || this.form.getSearchParams();
    const args: TZHRequestParams = {
      url: this.request?.value?.list?.url || '',
      conditions: params,
      successMessage: this.request?.value?.list?.successMessage,
      errorMessage: this.request?.value?.list?.errorMessage,
    };
    // console.log('params', params);
    // 获取数据
    const result: TZHTableRequestResult = await ZHRequest.post(args);
    // 处理数据
    if (result.success) {
      if (isScroll) {
        this.data.value = this.data.value.concat(result.data.records);
      } else {
        this.data.value = result.data.records;
      }

      this.pageData.value.total = result.data.total;
    } else {
      this.data.value = [];
      this.pageData.value.total = 0;
    }
    this.loading.value = false;
  };

  // 无限滚动
  _handleScrollEvent = async (params: any) => {
    const tableDom = params.$event.target;
      if (this._isInChangePageRange(params.scrollHeight, params.scrollTop, tableDom.clientHeight) && this.data.value.length < this.pageData.value.total) {
      this.pageData.value.current++;
      this.initData(null, false, true);
    }
  };

  // 滚动范围 -4 ~ 4
  _isInChangePageRange = (scrollHeight:number, scrollTop: number, clientHeight: number) => {
    if ((scrollHeight - scrollTop - clientHeight >= 0 && scrollHeight - scrollTop - clientHeight <= 4) ||
    (scrollHeight - scrollTop - clientHeight >= -4 && scrollHeight - scrollTop - clientHeight <= 0)) {
      return true;
    }
    return false;
  };

  debounceInitData = debounce(this.initData, 500);
  throttleInitData = throttle(this.initData, 1500);

  getData = () => { return this.data.value; };

  getDataAsync = async (propParams?: Object) => {
    const params = propParams || this.form.getSearchParams();
    const result: TZHTableRequestResult = await ZHRequest.post(params);
    return result;
  };

  getDataWithInitTable = async (propParams: Object | null = null, initPage = true) => {
    await this.initData(propParams, initPage);
    return this.data.value;
  };

  batchDelete = async () => {
    const msgResult = await isMessageConfirm('确认删除？', '提示');
    if (!msgResult) return;
    const selections = this.refTable.value.getSelectionRows();
    const params: TZHRequestParams = {
      url: this.request?.value?.batchDelete?.url || '',
      conditions: {
        ids: selections.map((x: any) => x.id),
      },
    };
    const result: TZHTableRequestResult = await ZHRequest.post(params);
    if (result.success) {
      this.debounceInitData();
    }
  };

  rowDelete = async (row: any) => {
    const msgResult = await isMessageConfirm('确认删除？', '提示');
    if (!msgResult) return;
    const params: TZHRequestParams = {
      url: this.request?.value?.delete?.url || '',
      conditions: { ...row },
    };
    const result: TZHTableRequestResult = await ZHRequest.post(params);
    if (result.success) {
      this.debounceInitData();
    }
  };

  rowClick = async (row: any, column: any, event: any) => {
    this.tableSettings.value.rowClick &&
      this.tableSettings.value.rowClick({ row, column, event });
  };


  //#region 相关功能行内编辑
  cellMouseOver = ref(); // 鼠标移入到的单元格
  cellEditList = ref([] as Array<any>);
  _convertPropToEditingProp = (prop: string) => { return prop + 'editing'; };
  _convertEditingPropToProp = (editingProp: string) => { return editingProp.substring(0, editingProp.length - 7); };

  cellCanShowEdit = (scope: any) => {
    return this.cellMouseOver.value?.index === scope.$rowIndex &&
      this.cellMouseOver.value?.$columnIndex === scope.$columnIndex;
  };

  cellCanShowSaveCancel = (scope: any) => {
    return !(this.cellMouseOver.value?.index === scope.$rowIndex &&
      this.cellMouseOver.value?.$columnIndex === scope.$columnIndex) && this.cellEditList.value.find((x: any) => x.index === scope.$rowIndex && x.$columnIndex === scope.$columnIndex);
  };

  cellContentOver = (scope: any) => {
    if (this.cellCanShowSaveCancel(scope)) return;
    this.cellMouseOver.value = { index: scope.$rowIndex, $columnIndex: scope.$columnIndex };
  };

  cellContentLeave = (scope: any) => {
    this.cellMouseOver.value = null;
  };

  clickInlineEdit = (scope: any) => {
    this.cellMouseOver.value = null;
    this.cellEditList.value.push({ index: scope.$rowIndex, $columnIndex: scope.$columnIndex });
    scope.row[this._convertPropToEditingProp(scope.column.property)] = scope.row[scope.column.property];
  };

  clickInlineCancel = (scope: any) => {
    this.cellMouseOver.value = null;
    this.cellEditList.value = this.cellEditList.value.filter((x: any) => x.index !== scope.$rowIndex || x.$columnIndex !== scope.$columnIndex);
  };

  clickInlineSave = (scope: any) => {
    if (this.tableSettings.value.modal?.customValidate && !this.tableSettings.value.modal?.customValidate(scope.row)) return;
    // 调用接口触发
    popSuccessMessage('修改成功');
    scope.row[scope.column.property] = scope.row[this._convertPropToEditingProp(scope.column.property)];
    this.cellMouseOver.value = null;
    this.cellEditList.value = this.cellEditList.value.filter((x: any) => x.index !== scope.$rowIndex || x.$columnIndex !== scope.$columnIndex);
  };

  //#endregion
}
