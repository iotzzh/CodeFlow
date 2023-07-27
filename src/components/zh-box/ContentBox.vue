<template>
    <div class="zh-layout" v-bind="$attrs">
        <slot></slot>
    </div>
</template>

<style lang="scss" scoped>
.zh-layout {
    height: 100%;
    width: 100%;
    overflow: hidden;
}
</style>