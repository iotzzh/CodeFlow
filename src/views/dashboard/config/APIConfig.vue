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
                                <component is="Delete"></component>
                            </el-icon>
                        </div>
                    </div>
                </el-collapse-item>
            </el-collapse>
        </el-scrollbar>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, toRefs, watch } from 'vue';
import ZHForm from '@/components/zh-form/index.vue';
import { debounce } from 'lodash';

import { TZHformConfig } from '@/components/zh-form/type';
import { ipcRenderer } from 'electron';
const props = defineProps({
    workspacePath: {
        type: String,
        required: true, // 必传
    },
});

const { workspacePath } = toRefs(props);
const proxyes = ref([] as any);
onMounted(() => {
    const res = ipcRenderer.sendSync('file:getProxy', workspacePath.value);
    proxyes.value = res.data;
});

const updateProxy = (newVal: any) => {
    const res = ipcRenderer.sendSync('file:updateProxy', workspacePath.value, newVal);
    console.log(res);
};

const thisDebounce = ref();

watch(() => proxyes.value, (newVal: any) => {
    if (thisDebounce.value) clearTimeout(thisDebounce.value)
    thisDebounce.value = setTimeout(() => {
        updateProxy(newVal)
    }, 2000)
}, { deep: true });

const model = ref({});

const config = ref({
    fields: [
        { label: '', prop: 'title0', type: 'text-title', labelWidth: '0px', defaultValue: 'API管理', style: { fontSize: '20px' } },
        { label: '', prop: 'title00', type: 'text-title', labelWidth: '0px', defaultValue: '通用配置', style: {} },
        { label: '标签', prop: 'label', type: 'input', style: {} },

        { label: '', prop: 'title1', type: 'text-title', labelWidth: '0px', defaultValue: '本地配置', style: {} },
        { label: 'Mock', prop: 'useMock', type: 'select', defaultOptions: [{ label: '继承', value: null }, { label: '使用', value: true }, { label: '不使用', value: false }] },
        { label: '前缀', prop: 'useMock', type: 'select', defaultOptions: [{ label: '继承', value: null }, { label: '使用', value: true }, { label: '不使用', value: false }] },

        { label: '', prop: 'title2', type: 'text-title', labelWidth: '0px', defaultValue: '部署配置', style: {} },
        { label: 'Mock', prop: 'useMock', type: 'select', defaultOptions: [{ label: '继承', value: null }, { label: '使用', value: true }, { label: '不使用', value: false }] },
        { label: '前缀', prop: 'useMock', type: 'select', defaultOptions: [{ label: '继承', value: null }, { label: '使用', value: true }, { label: '不使用', value: false }] },


        { label: '', prop: 'button0', type: 'button', buttonType: 'primary', defaultValue: '保存', style: {} },

        { label: '', prop: 'title3', type: 'text-title', labelWidth: '0px', defaultValue: '本地代理配置', style: {} },

        {
            label: '', prop: 'button1', type: 'button', buttonType: 'primary', defaultValue: '新增代理', icon: 'Plus', style: {},
            clickMethod: () => {
                proxyes.value.unshift({ name: '/api', value: { target: 'https://' } });
            },
        },
    ]
} as TZHformConfig);

const activeName = ref('1')
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

}</style>