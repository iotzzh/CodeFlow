import { computed, Ref, ref } from 'vue';
import { TZHTableConfig, TZHTablePageConfig,TZHTableRequestConfig, TZHTableRequestConfigResult  } from './type';
import Form from './form';
import { isMessageConfirm, popErrorMessage, popSuccessMessage } from '../zh-message';
import { TZHRequestParams } from '../zh-request/type';
import ZHRequest from '../zh-request';
import { debounce, throttle } from 'lodash';
import { TZHformConfig } from '../zh-form/type';

export default class Table {
  refTable: any;
  pageData: any;
  form: Form;
  emit: any;
  tableConfig: TZHTableConfig;
  request: TZHTableRequestConfig | undefined;
  globalTable: any;
  constructor(
    tableConfig: TZHTableConfig,
    refTable: any,
    request: TZHTableRequestConfig | undefined,
    form: Form,
    pageData: Ref<TZHTablePageConfig>,
    emit: any,
    globalTable:any
  ) {
    this.tableConfig = tableConfig;
    this.refTable = refTable;
    this.request = request;
    this.pageData = pageData;
    this.form = form;
    this.emit = emit;
    this.globalTable = globalTable;
  }

  data = ref([] as any);
  loading = ref(false);

  columns = computed(() => {
    return this.tableConfig.columns?.filter((x: any) => !x.notDisplay);
  });

  onBeforeInitData = async () => {
    if(!this.tableConfig.onBeforeInitData) return;
    if (typeof this.tableConfig.onBeforeInitData === 'string') {
      (new Function('params', this.tableConfig.onBeforeInitData))({ });
    } else {
      const method: Function = this.tableConfig.onBeforeInitData;
      await method();  
    }
  };

  convertTableData = (data:Array<any>) => {
    if(!this.tableConfig.convertTableData) return data;
    if (typeof this.tableConfig.convertTableData === 'string') {
      const convertedData = (new Function('data', this.tableConfig.convertTableData))(data);
      return convertedData;
    } else {
      const method: Function = this.tableConfig.convertTableData;
      const convertedData = method(data);
      return convertedData;  
    }
  };

  initData = async (propParams: Object | null = null, initPage = true,) => {
    this.onBeforeInitData();
    this.loading.value = true;
    // this.refTable.value.store.states.lazyTreeNodeMap.value = [];
    // 参数
    if (initPage) this.pageData.value.current = 1;
    const params = propParams || this.form.getSearchParams();
    const args: TZHRequestParams = {
      url: this.request?.list?.url || '',
      conditions: params,
      successMessage: this.request?.list?.successMessage,
      errorMessage: this.request?.list?.errorMessage,
    };
    // console.log('params', params);
    // 获取数据
    const result: TZHTableRequestConfigResult = await ZHRequest.post(args);
    // 处理数据
    if (result.success) {
      this.data.value = this.convertTableData(result.data.records || result.data);
      this.pageData.value.total = isNaN(Number(result.data.total)) ? 0 : Number(result.data.total);
    } else {
      this.data.value = [];
      this.pageData.value.total = 0;
    }
    this.loading.value = false;
  };

  debounceInitData = debounce(this.initData, 500);
  throttleInitData = throttle(this.initData, 1500);

  getData = () => { return this.data.value; };

  setData = (data: Array<any>) => { this.data.value = data; };

  getDataAsync = async (propParams?: Object) => {
    const params = propParams || this.form.getSearchParams();
    const result: TZHTableRequestConfigResult = await ZHRequest.post(params);
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
      url: this.request?.batchDelete?.url || '',
      conditions: {
        ids: selections.map((x: any) => x.id),
      },
    };
    const result: TZHTableRequestConfigResult = await ZHRequest.post(params);
    if (result.success) {
      this.debounceInitData();
      this.refTable.value && this.refTable.value.clearSelection();
    }
  };

  loadMap = ref(new Map());

  load = (row: any, treeNode: any, resolve: (data: any[]) => void) => {
    this.tableConfig.load && this.tableConfig.load(row, treeNode, resolve);

    //将获取到的节点数据添加到loadMap变量中
    this.loadMap.value.set(row.id, { row, treeNode, resolve });
  };

  reloadTableTreeChild = (parentId: any) => {
    // parentId = parentId ? parseInt(parentId) : 0;
    if (!parentId || !this.loadMap.value.get(parentId)) return;
    const { row, treeNode, resolve } = this.loadMap.value.get(parentId);

    //通过ref获取table的子节点数
    if (!!this.refTable.value.store.states.lazyTreeNodeMap.value[parentId] && this.refTable.value.store.states.lazyTreeNodeMap.value[parentId].length > 1) {
      //说明该节点下有多个子节点
      this.refTable.value.store.states.lazyTreeNodeMap[parentId] = [];
    } else {
      //说明该节点只有一个节点
      this.refTable.value.store.states.lazyTreeNodeMap.value[parentId] =
        [];
    }

    this.load(row, treeNode, resolve);

  };

  rowDelete = async (row: any) => {
    const msgResult = await isMessageConfirm('确认删除？', '提示');
    if (!msgResult) return;
    const params: TZHRequestParams = {
      url: this.request?.delete?.url || '',
      // conditions: { ...row },
      conditions: {
        ids: [row.id]
      },
    };
    const result: TZHTableRequestConfigResult = await ZHRequest.post(params);
    if (result.success) {
      if (this.tableConfig.load && (this.tableConfig.validateLoad === undefined ? true : this.tableConfig.validateLoad(row))) {
        this.reloadTableTreeChild(row.parentId);
      } else {
        this.debounceInitData();
        this.refTable.value && this.refTable.value.clearSelection();
      }
    }
  };

  rowClick = async (row: any, column: any, event: any) => {
    if (!this.tableConfig.rowClick) return;

    if (typeof this.tableConfig.rowClick === 'string') 
      (new Function('params', this.tableConfig.rowClick))({ row, column, event, refTable: this.refTable.value });
    else this.tableConfig.rowClick({ row, column, event });
  };

  tableColumnConvert = (convert: string | Function, row: any, index: number) => {
    if (typeof convert === 'string') return (new Function('row, index', convert))(row, index);
    else return convert(row, index);
  };

  tableRowActionOnClick = (method: string | Function | undefined, row: any, index: number) => {
    if (!method) return;
    if (typeof method === 'string') {
      const func = new Function('params', method);
      return func({row, index,  modal: this.globalTable.value.modal });

    } else {
      return method(row, index);
    }
  };

  //#region 相关功能行内编辑
  cellMouseOver = ref(); // 鼠标移入到的单元格
  cellEditList = ref([] as Array<any>);
  _convertPropToEditingProp = (prop: string) => { return prop + 'editing'; };
  _convertEditingPropToProp = (editingProp: string) => { return editingProp.substring(0, editingProp.length - 7); };

  cellCanShowEdit = (scope: any) => {
    return this.cellMouseOver.value?.index === scope.$index &&
      this.cellMouseOver.value?.cellIndex === scope.cellIndex;
  };

  cellCanShowSaveCancel = (scope: any) => {
    return !(this.cellMouseOver.value?.index === scope.$index &&
      this.cellMouseOver.value?.cellIndex === scope.cellIndex) && this.cellEditList.value.find((x: any) => x.index === scope.$index && x.cellIndex === scope.cellIndex);
  };

  cellContentOver = (scope: any) => {
    if (this.cellCanShowSaveCancel(scope)) return;
    this.cellMouseOver.value = { index: scope.$index, cellIndex: scope.cellIndex };
  };

  cellContentLeave = (scope: any) => {
    this.cellMouseOver.value = null;
  };

  clickInlineEdit = (scope: any) => {
    this.cellMouseOver.value = null;
    this.cellEditList.value.push({ index: scope.$index, cellIndex: scope.cellIndex });
    scope.row[this._convertPropToEditingProp(scope.column.property)] = scope.row[scope.column.property];
  };

  clickInlineCancel = (scope: any) => {
    this.cellMouseOver.value = null;
    this.cellEditList.value = this.cellEditList.value.filter((x: any) => x.index !== scope.$index || x.cellIndex !== scope.cellIndex);
  };

  clickInlineSave = (scope: any) => {
    // if (this.tableConfig.modal?.customValidate && !this.tableConfig.modal?.customValidate(scope.row)) return;
    // 调用接口触发
    popSuccessMessage('修改成功');
    scope.row[scope.column.property] = scope.row[this._convertPropToEditingProp(scope.column.property)];
    this.cellMouseOver.value = null;
    this.cellEditList.value = this.cellEditList.value.filter((x: any) => x.index !== scope.$index || x.cellIndex !== scope.cellIndex);
  };
  //#endregion
}
