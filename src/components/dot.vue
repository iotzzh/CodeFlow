<!--
 * @Author: zzh
 * @Date: 2022-03-29 10:57:26
 * @LastEditors: zzh
 * @LastEditTime: 2022-04-10 17:08:09
 * @Description: 点
 * @FilePath: \zh-admin\src\components\dot.vue
-->
<template>
    <div class="dot" :style="{width: width, height: width, backgroundColor: color, borderRadius: '50%' }"></div>
</template>
<script lang="ts" setup>
import { toRefs } from 'vue';

const props = defineProps({
    width: {
        type: String
    },
    color: {
        type: String
    }
});

const { width, color } = toRefs(props);
</script>

<script lang="ts">
export default { name: 'dot' };
</script>


