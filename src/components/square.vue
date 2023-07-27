<!-- 正方形 -->
<template>
    <div class="square" style="display: inline-block;" :style="{width: sideLength, height: sideLength, backgroundColor: color }" ></div>
</template>
<script lang="ts" setup>
import { toRefs } from 'vue';

const props = defineProps({
    sideLength: {
        type: String
    },
    color: {
        type: String
    }
});

const { sideLength, color } = toRefs(props);
</script>

<script lang="ts">
export default { name: 'square' };
</script>


