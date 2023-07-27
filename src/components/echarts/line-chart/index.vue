<template>
    <div class="e-line-chart" v-loading="loading" ref="refELineChart" :id="id" :style="{ width: '800px', height: '400px' }">
    </div>
</template>

<script lang="ts" setup>
import { number } from '@intlify/core-base';
import * as echarts from 'echarts';
import { ref, onMounted, PropType, toRefs } from 'vue';
import { getUUID } from '../utils';

const props = defineProps({
    width: {
        type: Number,
    },
    modelValue: {
        type: Object as PropType<any>,
    },

    convertedModel: {
        type: Object as PropType<any>,
    },
});

const { modelValue, convertedModel } = toRefs(props);

const id = ref(getUUID());
const refELineChart = ref();
const loading = ref(false);

onMounted(() => {
    loading.value = true;
    const dom = refELineChart.value; // 获取dom节点
    const myChart = echarts.init(dom); // 初始化echarts实例
    const option = {
        xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                data: [820, 932, 901, 934, 1290, 1330, 1320],
                type: 'line',
                smooth: true
            }
        ]
    };
    // 设置实例参数
    myChart.setOption(option);

    loading.value = false;
});

</script>