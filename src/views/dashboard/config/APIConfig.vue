<template>
    <div class="box">
        <ZHForm v-model="model" :form-config="config"></ZHForm>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import ZHForm from '@/components/zh-form/index.vue';
import { TZHformConfig } from '@/components/zh-form/type';

const model = ref({});

const config = ref({
    fields: [
        {  }
    ]
} as TZHformConfig);


</script>