<template>
    <div class="box" style="background-color: white;">
        <el-scrollbar style="width: 100%;">
            <ZHForm v-model="model" :form-config="config"></ZHForm>
            <el-collapse v-model="activeName" accordion>
                <el-collapse-item :title="proxy.name + (proxy.value?.desc ? ' : ' + proxy.value?.desc : '')" :name="index"
                    v-for="(proxy, index) in proxyes" :key="index">
                    <div class="prox-box">
                        <div class="content">
                            <div class="row">
                                <div class="label">代理对象</div>
                                <el-input v-model="proxy.name" style="flex: 1;"></el-input>
                            </div>
                            <div class="row">
                                <div class="label">代理目标</div>
                                <el-input v-model="proxy.value.target" style="flex: 1;"></el-input>
                            </div>
                            <div class="row">
                                <div class="label">备注</div>
                                <el-input v-model="proxy.value.desc" style="flex: 1;"></el-input>
                            </div>
                        </div>
                        <div class="action">
                            <el-icon style="color: red;">
                                <component is="Delete" @click="() => deleteProxy(index)"></component>
                            </el-icon>
                        </div>
                    </div>
                </el-collapse-item>
            </el-collapse>
        </el-scrollbar>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref, toRefs, watch } from 'vue';
import ZHForm from '@/components/zh-form/index.vue';
import { debounce } from 'lodash';
import { useApiStore } from '@/stores';

import { TZHformConfig } from '@/components/zh-form/type';
import { ipcRenderer } from 'electron';
const props = defineProps({
    workspacePath: {
        type: String,
        required: true, // 必传
    },
});

const { workspacePath } = toRefs(props);

const apiStore = useApiStore();

const model = ref({} as any);

const config = ref({
    fields: [
        { label: '', prop: 'label', type: 'text-title', labelWidth: '0px', defaultValue: 'API配置面板', style: { fontSize: '20px' } },
        { label: '', prop: 'titleGeneral', type: 'text-title', labelWidth: '0px', defaultValue: '通用配置', style: {} },
        { label: '标签', prop: 'label', type: 'input', style: {},  },
        { label: '名称', prop: 'name', type: 'input', style: {}, hide: (model:any) => apiStore?.selectedRoute?.type !== 'api' },
        { label: 'url', prop: 'url', type: 'input', style: {}, hide: (model:any) => apiStore?.selectedRoute?.type !== 'api' },

        { label: '', prop: 'title1', type: 'text-title', labelWidth: '0px', defaultValue: '本地配置', style: {} },
        { label: 'Mock', prop: 'localUseMock', type: 'select', defaultOptions: [{ label: '继承', value: '' }, { label: '使用', value: true }, { label: '不使用', value: false }] },
        { label: '前缀', prop: 'localPrefix', type: 'select' },

        { label: '', prop: 'title2', type: 'text-title', labelWidth: '0px', defaultValue: '部署配置', style: {} },
        { label: 'Mock', prop: 'useMock', type: 'select', defaultOptions: [{ label: '继承', value: '' }, { label: '使用', value: true }, { label: '不使用', value: false }] },
        { label: '前缀', prop: 'prefix', type: 'select' },

        { label: '', prop: 'title3', type: 'text-title', labelWidth: '0px', defaultValue: '本地代理配置', style: {} },

        {
            label: '', prop: 'button1', type: 'button', buttonType: 'primary', defaultValue: '新增代理', icon: 'Plus', style: {},
            clickMethod: () => {
                proxyes.value.unshift({ name: '/api', value: { target: 'https://' }, changeOrigin: true });
            },
        },
    ]
} as TZHformConfig);

const activeName = ref('1')

const proxyes = ref([] as any);

onMounted(() => {
    const res = ipcRenderer.sendSync('file:getProxy', workspacePath.value);
    proxyes.value = res.data;
    updatePrefix(res.data);
});

const updatePrefix = (data: any) => {
    const fields: any = config.value.fields?.filter((x: any) => x.label === '前缀');
    fields && fields.forEach((x: any) => {
        x.defaultOptions = data.map((x: any) => { return { label: x.name, value: x.name } });
    });
};

const updateProxy = (newVal: any) => {
    const res = ipcRenderer.sendSync('file:updateProxy', workspacePath.value, newVal);
    console.log(res);
};

const deleteProxy = (index: any) => {
    proxyes.value.splice(index, 1);
    const res = ipcRenderer.sendSync('file:updateProxy', workspacePath.value, proxyes.value);
    console.log(res);
};

const thisDebounce = ref();

watch(() => proxyes.value, (newVal: any, oldVal: any) => {
    if (!oldVal || Object.keys(oldVal).length === 0) return;
    if (thisDebounce.value) clearTimeout(thisDebounce.value)
    thisDebounce.value = setTimeout(() => {
        updateProxy(newVal ? JSON.stringify(newVal) : '');
        updatePrefix(newVal);
    }, 2000)
}, { deep: true });

watch(() => apiStore.selectedRoute, (newVal: any) => {
    // console.log('newVal: ', newVal);
    model.value = { ...model.value, ...newVal.route };
    // model.value = newVal.route;
    // model.value.label = newVal.data.label;
    // model.value.localUseMock = newVal.data.localUseMock;
    // model.value.useMock = newVal.data.useMock;
});

const KEYS = ['label', 'prefix', 'useMock', 'localPrefix', 'localUseMock', 'name', 'url'];

watch(() => model.value, async (newVal: any, oldVal: any) => {
    // console.log('newVal: ', newVal);
    // console.log('oldVal: ', oldVal);
    if (!(newVal.label === oldVal.label && newVal.type === oldVal.type)) return;
    const keys = Object.keys(newVal);
    // apiStore.selectedRoute.route = newVal;


    if (apiStore?.selectedRoute?.type === 'file') {
        const newRoute = JSON.parse(JSON.stringify(apiStore.selectedRoute.route));
        for (let key of keys) {
            if (KEYS.find(x => x === key)) newRoute[key] = newVal[key];
        }
        console.log(' apiStore.selectedRoute: ', apiStore.selectedRoute);
        const res = await ipcRenderer.sendSync('file:updateApi', workspacePath.value, apiStore.selectedRoute.fileName, JSON.stringify(newRoute));

    } else if (apiStore?.selectedRoute?.type === 'api') {
        // fileData
        const fileData = JSON.parse(JSON.stringify(apiStore.selectedRoute.fileData));
        const api = fileData.api.find((x: any) => x.name === model.value.name);
        for (let key of keys) {
            if (KEYS.find(x => x === key)) api[key] = newVal[key];
        }
        console.log(' apiStore.selectedRoute: ', apiStore.selectedRoute);
        const res = await ipcRenderer.sendSync('file:updateApi', workspacePath.value, apiStore.selectedRoute.fileName, JSON.stringify(fileData));
    } else {
        console.log('未知类型');
    }
    apiStore.setNeedRefresh(true);
}, { deep: true, });

onUnmounted(() => {
    apiStore.clearSelectedRoute();
});




</script>

<style lang="scss" scoped>
.box .zh-form {
    width: 100%;
    overflow: hidden;
}

.prox-box {
    display: flex;

    .content {
        display: flex;
        flex-direction: column;
        flex: 1;

        .row {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: 15px;

            .label {
                width: 80px;
                text-align: right;
                padding-right: 7px;
            }
        }
    }

    .action {
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
    }

}
</style>