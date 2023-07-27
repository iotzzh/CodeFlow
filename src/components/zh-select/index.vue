<template>
    <div class="zh-select">
        <el-select 
            v-model="value" 
            :loading="loading" 
            :loading-text="loadingText" 
            :multiple="multiple"
            :disabled="isDisabled" 
            :style="{ width: width ? `${width}` : '100%' }" 
            :value-key="valueKey || undefined"
            @change="change"
            :clearable="clearable === undefined ? true : clearable"
            :filterable="filterable === undefined ? true : filterable"  
            :remote="remote" 
            :remote-method="onRemoteMethod"
            :automaticDropdown="automaticDropdown"
            :size="size" 
            :autocomplete="autocomplete"
            :effect="effect"
            :allowCreate="allowCreate"
            :filterMethod="filterMethod"
            :multipleLimit="multipleLimit"
            :defaultFirstOption="defaultFirstOption"
            :reserveKeyword="reserveKeyword"
            :collapseTags="collapseTags"
            :collapseTagsTooltip="collapseTagsTooltip"
            :persistent="persistent"
            :clearIcon="clearIcon"
            :fitInputWidth="fitInputWidth"
            :suffixIcon="suffixIcon"
            :validateEvent="validateEvent"
            :remoteShowSuffix="remoteShowSuffix"
            :suffixTransition="suffixTransition"
            :placement="placement"
            :popperClass="popperClass"
            :placeholder="placeholder
                ? placeholder
                : remoteMethod
                    ? '请输入选择'
                    : '请选择'
                ">
            <el-option v-for="(item, index) in (options as any)" :key="valueKey ? item[valueKey] : index"
                :label="useLabelField(item)"
                :value="valueKey ? item : (valueField ? item[valueField] : item.value)"></el-option>

            <template #prefix v-if="prefix">
                <span v-if="(typeof prefix === 'string')">{{ prefix }}</span>
            </template>
        </el-select>

    </div>
</template>
  
<script setup lang="ts">
import { toRefs, ref, onMounted, PropType, watch } from 'vue';

import { TZHRequestParams } from '../zh-request/type';
import ZHRequest from '../zh-request';
import { computed } from 'vue';
import { ComponentSize } from 'element-plus/es/constants/size';

type disabledFun = (modelValue: any) => boolean

const props = defineProps({
    // name: String,
    // id: String,
    modelValue: {
        type: [Array, String, Number, Boolean, Object],
    },
    labelField: {
        type: String
    },
    valueField: {
        type: String
    },
    width: {},
    disabled: {
        type: Boolean || Function,
    },
    multiple: Boolean,
    autocomplete: {
        type: String,
        default: 'off',
    },
    automaticDropdown: Boolean,
    size: {
        type: String as PropType<ComponentSize>,
    },
    effect: {
        type: String as PropType<'light' | 'dark' | string>,
        default: 'light',
    },
    clearable: {
        type: Boolean || undefined,
        default: undefined,
    },
    filterable: Boolean,
    allowCreate: Boolean,
    // loading: Boolean,
    popperClass: {
        type: String,
        default: '',
    },
    remote: Boolean,
    loadingText: String,
    noMatchText: String,
    noDataText: String,
    remoteMethod: Function,
    remoteRequestSize: Number,
    remoteRequestParams: Object || String, // 示例：当item是对象时：{ userId: id }， 当item是一个值时 userId
    filterMethod: Function,

    multipleLimit: {
        type: Number,
        default: 0,
    },
    placeholder: {
        type: String,
    },
    defaultFirstOption: Boolean,
    reserveKeyword: {
        type: Boolean,
        default: true,
    },
    valueKey: {
        type: String,
    },
    collapseTags: Boolean,
    collapseTagsTooltip: {
        type: Boolean,
        default: false,
    },
    persistent: {
        type: Boolean,
        default: true,
    },
    clearIcon: {},
    fitInputWidth: {
        type: Boolean,
        default: false,
    },
    suffixIcon: {},
    validateEvent: {
        type: Boolean,
        default: true,
    },
    remoteShowSuffix: {
        type: Boolean,
        default: false,
    },
    suffixTransition: {
        type: Boolean,
        default: true,
    },
    placement: {
        type: String,
        default: 'bottom-start',
    },
    requestDataWhenMounted: {
        type: Boolean,
        default: true
    },
    defaultOptions: {
        type: Array,
    },
    conditions: {
        type: Object,
    },
    api: {
        type: String
    },
    apiResultProperty: {
        type: Array
    },
    prefix: {
        type: String || Object as PropType<{[x:string]:any}>,
    }
});

const {
    modelValue,
    defaultOptions,
    labelField,
    valueField,
    conditions,
    api,
    apiResultProperty,
    requestDataWhenMounted,
    disabled,
    placeholder,
    remote,
    remoteMethod,
    remoteRequestSize,
    remoteRequestParams,
    valueKey,
    clearable,
    filterable,
    multiple,
    automaticDropdown,
    size,
    autocomplete,
    effect,
    allowCreate,
    filterMethod,
    multipleLimit,
    defaultFirstOption,
    reserveKeyword,
    collapseTags,
    collapseTagsTooltip,
    persistent,
    clearIcon,
    fitInputWidth,
    suffixIcon,
    validateEvent,
    remoteShowSuffix,
    suffixTransition,
    placement,
    popperClass,
    prefix
} = toRefs(props);

const emit = defineEmits(['update:modelValue']);

const isDisabled = computed(() => {
    let result = false;
    if (!disabled.value) return result;
    if (typeof disabled.value === 'boolean') return disabled.value;
    if (typeof disabled.value === 'function') return (disabled.value as disabledFun)(modelValue?.value);
    return result;
});

const useLabelField = (item: any) => {
    return labelField?.value ? item[labelField.value] : item.label;
};

const loading = ref(false);
const options = ref(defaultOptions && defaultOptions.value);

const getDeepValue = (obj: any, currProp: any, level: number): any => {
    let value = obj[currProp]; // 当前层级的属性值
    level++; // 增加一层

    if (typeof value === 'object' && value !== null) { // 如果当前属性值是一个对象，则继续遍历
        getDeepValue(value, currProp + '.' + (level - 1), level); // 递归调用函数，获取下一层级的属性值
    } else { // 否则，直接返回当前属性值
        return value;
    }

    return getDeepValue(obj, currProp, level); // 返回下一层级的属性值
};

const getList = async (value: { [x: string]: any } | string = '') => {
    if (!api || !api.value) return;
    loading.value = true;
    const params: TZHRequestParams = { url: api.value };
    params.conditions = conditions?.value || {};
    // 设置远程搜索参数
    if (remote.value && remoteRequestParams?.value) {
        params.conditions.size = remoteRequestSize?.value || 20;
        if (typeof remoteRequestParams.value === 'string') {
            params.conditions[remoteRequestParams.value] = value;
        } else {
            const keys = Object.keys(remoteRequestParams.value);
            for (let key of keys) {
                if (remoteRequestParams?.value && remoteRequestParams.value[key]) {
                    const valuekey = remoteRequestParams.value[key] as string || '';
                    if(typeof value === 'object')  params.conditions[key] = value[valuekey];
                }
            }
        }
    }
    const result = await ZHRequest.post(params);
    if (apiResultProperty && apiResultProperty.value && options) {
        options.value = getDeepValue(result, 'data.records', 0);
    } else {
        options.value = result.data.records;
    }
    loading.value = false;
};


const onRemoteMethod = (value: string | { [x: string]: any }) => {
    if (!remote.value) return;
    getList(value);
};

onMounted(() => {
    if (requestDataWhenMounted && requestDataWhenMounted.value) {
        getList();
    }
    if (valueKey?.value && modelValue?.value && typeof modelValue.value !== 'object') {
        const key = valueKey.value;
        const item = options.value?.find((x: any) => x[key] === modelValue.value);
        if (item) {
            value.value = item;
            emit('update:modelValue', item);
        }
    }
});

const setValue = (newValue: any) => {
    if (!valueKey?.value) {
        value.value = newValue;
        emit('update:modelValue', newValue);
    } else {
        if (typeof newValue !== 'object') {
            const key = valueKey.value;
            const item = options.value?.find((x: any) => x[key] === newValue);
            if (item) {
                value.value = item;
                emit('update:modelValue', item);
            }
        }
    }
};



const value = ref(modelValue?.value);
const change = (newVal: any) => {
    emit('update:modelValue', newVal);
};

watch(() => modelValue!.value, (newVal:any) => {
    if (newVal !== value.value) {
        value.value = newVal;
    }
},  { deep: true });

const setOptions = (newOptions: any) => {
    options.value = newOptions;
};

const setLoading = (isLoading:boolean) => {
    loading.value = isLoading;
};

defineExpose({
    getList,
    setOptions,
    setValue,
    setLoading,
});
</script>
  
<script lang="ts">
export default { name: 'ZHSelect' };
</script>
  
<style lang="scss" scope>
@import './index.scss';
</style>
  