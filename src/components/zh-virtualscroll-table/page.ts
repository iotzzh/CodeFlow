import { Ref, ref } from 'vue';
import { TZHTablePage, TZHTablePageSetting } from './type';
import Table from './table';

export default class {
  pageSettings: TZHTablePageSetting | undefined;
  sizes: any;
  pagerCount: any;
  total: any;
  layout: any;
  pageData: any;
  table: Table;
  constructor(
    pageSettings: TZHTablePageSetting | undefined,
    pageData: Ref<TZHTablePage>,
    table: Table) {
    this.sizes = ref(pageSettings?.sizes || [100, 200, 500, 1000]);
    this.pagerCount = ref(pageSettings?.pagerCount || 5);
    this.total = ref(pageData.value.total);
    this.layout = ref(pageSettings?.layout || 'total, sizes, prev, pager, next, jumper');
    this.pageData = pageData;
    this.table = table;
  }

  handleCurrentChange = (val: number) => {
    this.table.debounceInitData(null, true);
  };
}