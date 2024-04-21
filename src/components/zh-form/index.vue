<template>
  <el-form
    class="zh-form"
    v-bind="$attrs"
    ref="refForm"
    :model="modelValue"
    :rules="rules"
    :label-width="formConfig?.formLabelWidth || 'auto'"
    type="flex"
    inline
    justify="end"
    style="flex-wrap: wrap; flex-direction: row"
    :validate-on-rule-change="false"
  >
    <el-row style="display: flex; flex-wrap: wrap">
      <TransitionGroup name="list">
        <!-- xs: <768, sm: >=768, md: >= 992, lg: >= 1200, xl: >= 1920 -->
        <el-col
          v-for="(item, index) in fieldList"
          :key="index"
          :span="item.span"
          :xl="item.xl"
          :lg="item.lg"
          :md="item.md"
          :sm="item.sm"
          :xs="item.xs"
          :style="{ maxWidth: item.maxWidth, minWidth: item.minWidth }"
          v-show="!item.hide"
        >
          <el-form-item
            :key="'form-item' + index"
            :label="item.label"
            :prop="item.prop"
            :label-width="item.labelWidth"
            v-if="item.prop"
          >
            <!-- 输入框 -->
            <el-input
              v-if="item.type === 'input'"
              :ref="(el: any) => {
              if (item.refName) itemRefs[item.refName] = el;
            }"
              :style="{ width: item.width ? `${item.width}` : '100%' }"
              :show-password="item.showPassword"
              v-model="modelValue[item.prop]"
              :placeholder="item.placeholder"
              :disabled="
                item.disabled === undefined
                  ? false
                  : typeof item.disabled === 'boolean'
                  ? item.disabled
                  : item.disabled(modelValue)
              "
              :type="item.inputType"
              :clearable="item.clearable === undefined ? true : item.clearable"
              :suffix-icon="item.suffixIcon"
              @focus="(e: any) => formInstance.inputFocus(e, item, modelValue, itemRefs[item.refName || ''])"
            >
              <template #append v-if="item.appendSuffixIcon">
                <el-icon style="cursor: pointer">
                  <component
                    :is="item.appendSuffixIcon"
                    @click="(e: any) => formInstance.clickInputAppendSuffixIcon(e, item, modelValue, itemRefs[item.refName || ''])"
                  >
                  </component>
                </el-icon>
              </template>
            </el-input>

            <!-- 文本显示 -->
            <span
              v-if="item.type === 'text'"
              :style="{ width: item.width ? `${item.width}` : '100%' }"
              >{{ modelValue[item.prop] }}</span
            >

            <!-- 开关 -->
            <el-switch
              v-else-if="item.type === 'switch'"
              :active-text="item.activeText"
              :inactive-text="item.inactiveText"
              :active-value="item.activeValue"
              :inactive-value="item.inactiveValue"
              v-model="modelValue[item.prop]"
            />

            <!-- 数字输入框 :min="1" :max="10" -->
            <el-input-number
              v-else-if="item.type === 'input-number'"
              :style="{ width: item.width ? `${item.width}` : '100%' }"
              v-model="modelValue[item.prop]"
              :placeholder="item.placeholder"
              :disabled="
                item.disabled === undefined
                  ? false
                  : typeof item.disabled === 'boolean'
                  ? item.disabled
                  : item.disabled(modelValue)
              "
              :clearable="item.clearable"
            />

            <ZHSelect
              v-else-if="item.type === 'select'"
              :style="{ width: item.width ? `${item.width}` : '100%' }"
              v-model="modelValue[item.prop]"
              :defaultOptions="item.defaultOptions"
              :api="item.api"
              :value-key="item.valueKey"
              :label-field="item.labelField"
              :value-field="item.valueField"
            >
            </ZHSelect>

            <!-- 日期选择 -->
            <el-date-picker
              v-else-if="item.type === 'date-picker'"
              v-model="modelValue[item.prop]"
              :disabled="
                item.disabled === undefined
                  ? false
                  : typeof item.disabled === 'boolean'
                  ? item.disabled
                  : item.disabled(modelValue)
              "
              :type="item.timeType"
              :format="item.timeShowFormat"
              :value-format="item.timeValueFormat"
              :placeholder="item.placeholder || '请选择'"
              :style="{ width: item.width ? `${item.width}` : '100%' }"
              :clearable="item.clearable"
            ></el-date-picker>

            <!-- 级联选择器  -->
            <el-cascader
              v-else-if="item.type === 'cascader'"
              :options="(item.options as CascaderOption[])"
              :props="item.props"
              :style="{ width: item.width ? `${item.width}` : '100%' }"
              @change="formInstance.changeCascader(itemRefs, item.refName, formConfig)"
              :ref="(el: any) => {
                if (item.refName) itemRefs[item.refName] = el;
              }"
              v-model="modelValue[item.prop]"
              :clearable="item.clearable"
            />

            <!-- 单选框组 -->
            <el-radio-group
              v-else-if="item.type === 'radio-group'"
              v-model="modelValue[item.prop]"
              :style="{ width: item.width ? `${item.width}` : '100%' }"
            >
              <el-radio
                v-for="(subItem, subIndex) in (item.options as Array<TZHFromFieldSelectOption>)"
                :key="subIndex"
                :label="subItem.value"
                >{{ subItem.label }}</el-radio
              >
            </el-radio-group>

            <!-- 多选框 -->
            <el-checkbox
              v-else-if="item.type === 'checkbox'"
              v-model="modelValue[item.prop]"
              :label="item.checkboxText"
              :size="item.size || 'default'"
            />

            <!-- 自定义筛选内容 -->
            <template v-else-if="item.type === 'slot'">
              <slot :name="'zh-form-' + item.prop" />
            </template>
          </el-form-item>
        </el-col>
      </TransitionGroup>
      <slot></slot>
      <span v-if="formConfig?.hideUnimportantFields" class="folder-box">
        <span
          class="unfolder"
          v-if="formInstance.hideUnimportantFields.value"
          @click="() => (formInstance.hideUnimportantFields.value = false)"
          >展开</span
        >
        <span
          v-else
          type="primary"
          link
          :icon="ArrowUp"
          size="large"
          class="folder"
          @click="() => (formInstance.hideUnimportantFields.value = true)"
          >折叠</span
        >
      </span>
    </el-row>
    <slot name="zh-form-next-row"></slot>
  </el-form>
</template>

<script setup lang="ts">
  import { toRefs, PropType, ref, computed, onMounted, watch } from 'vue';
  import Form from './index';
  import { TZHformConfig, TZHFromFieldSelectOption, TZHFromField } from './type';
  import { ArrowUp } from '@element-plus/icons-vue';
  import { CascaderOption } from 'element-plus';
  import ZHSelect from '@/components/zh-select/index.vue';

  const props = defineProps({
    modelValue: {
      type: Object as PropType<{ [x: string]: any }>,
      required: true,
    },

    convertedModel: {
      type: Object as PropType<{ [x: string]: any }>,
    },

    formConfig: {
      type: Object as PropType<TZHformConfig>,
      required: true,
    },
  });

  const { modelValue, formConfig, convertedModel } = toRefs(props);
  const refForm = ref();
  const itemRefs = ref([] as any);
  const emit = defineEmits(['update:modelValue', 'update:convertedModel']);

  const formInstance = new Form({
    emit,
    refForm,
    formConfig,
    modelValue,
    convertedModel,
  });

  const fieldList = computed(() => {
    if (formConfig && !!formConfig.value && !!formConfig.value.fields) {
      if (formInstance.hideUnimportantFields.value) {
        return formConfig.value.fields.filter((x: TZHFromField) => !x.unimportant);
      } else {
        return formConfig.value.fields;
      }
    } else {
      return [];
    }
  });

  const rules = computed(() => {
    const newRules: any = {};
    if (!formConfig?.value?.fields) return newRules;
    const fields: TZHFromField[] = formConfig.value.fields || [];
    for (const element of fields) {
      if (!element.prop) continue;
      if (element.required) {
        const requireMsg = element.type === 'input' ? '请输入' : '请选择';
        const requireEvent = element.type === 'input' ? 'blur' : 'change';
        // eslint-disable-next-line no-prototype-builtins
        if (element.hasOwnProperty(element.prop)) {
          newRules[element.prop].push({
            required: true,
            message: requireMsg + element.label,
            trigger: requireEvent,
          });
        } else {
          newRules[element.prop] = [];
          newRules[element.prop].push({
            required: true,
            message: requireMsg + element.label,
            trigger: requireEvent,
          });
        }
      }
    }
    if (formConfig && formConfig.value && !!formConfig.value.rules) {
      const keys = Object.keys(formConfig.value.rules);
      keys.forEach((key: any) => {
        newRules[key] =
          formConfig.value.rules &&
          formConfig.value.rules[key as keyof typeof formConfig.value.rules];
      });
    }
    return newRules;
  });

  onMounted(async () => {
    formInstance.init();
  });

  watch(
    () => modelValue.value,
    (newVal: any) => {
      formInstance.setConvertModel(newVal);
    },
    { deep: true },
  );

  defineExpose({
    validate: formInstance.validate,
    init: formInstance.init,
    clearFormData: formInstance.clearFormData,
  });
</script>

<script lang="ts">
  export default { name: 'ZHForm' };
</script>

<style lang="scss" scoped>
  .zh-form {
    transition-duration: 2s;
    transition: height 10s;
    background-color: white;
    padding: 7px;
    position: relative;

    .el-form-item {
      width: 100%;
    }

    &:deep(.el-col.el-col-0) {
      display: block;
      max-width: none !important;
    }

    .el-divider--horizontal {
      margin-bottom: 10px;
    }
  }

  .list-enter-active,
  .list-leave-active {
    transition: all 0.5s ease;
  }

  .list-enter-from,
  .list-leave-to {
    opacity: 0;
    transform: translateX(30px);
  }

  .folder-box {
    padding-top: 7px;
    // position: absolute;
    // right: 5px;
    // bottom: 0px;
  }

  .folder,
  .unfolder {
    font-size: 14px;
    padding: 7px;
    color: var(--el-color-primary);
  }
</style>

<style lang="scss"></style>
