<template>
    <div class="title">
        <div class="menus">
            <div class="menu">文件</div>
            <div class="menu">编辑</div>
            <div class="menu">启动</div>
            <div class="menu">帮助</div>
        </div>
        <div class="window-options">
            <div class="titlebtn min" @click="min">最小化</div>
            <div class="titlebtn max" @click="max">最大化</div>
            <div class="titlebtn close" @click="close">关闭</div>
        </div>
    </div>
    控制台
</template>

<script lang="ts" setup>
const id = 'dashboard';
const min = () => {
    window.electronAPI.minWindow(id);
}

const max = () => {
    window.electronAPI.maxWindow(id);
};

const close = () => {
    window.electronAPI.closeWindow(id);
};

</script>

<style lang="scss" scoped>
.title {
    height: 32px;
    background-color: rgba(0,0,0,0.8);
    -webkit-app-region: drag;
    display: flex;
    .menus, .window-options {
        flex: 1;
        display: flex;
        align-items: center;
        color: white;
        font-size: 14px;
    }
    .menus {
        .menu {
            margin-left: 20px;
            &:hover {
                cursor: pointer;
            }
        }
    }
    .window-options {
        justify-content: flex-end;
    }

    .titlebtn {
        -webkit-app-region: no-drag;
    }
}
</style>