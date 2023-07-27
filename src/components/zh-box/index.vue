<template>
  <component v-bind="$attrs" :is="useScrollContentBox ? ScrollContentBox : ContentBox">
    <slot></slot>
  </component>
</template>


<!-- Splitpanes: https://antoniandre.github.io/splitpanes/ -->
<!-- vue-splitpane -->
<script lang="ts" setup>
import { toRefs } from 'vue';
import ContentBox from './ContentBox.vue';
import ScrollContentBox from './ScrollContentBox.vue';

const props = defineProps({
  useScrollContentBox: {
    type: Boolean,
    required: false,
    default: true,
  },
});

const { useScrollContentBox } = toRefs(props);
</script>

<style lang="scss" scoped></style>