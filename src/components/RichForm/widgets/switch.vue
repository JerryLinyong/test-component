<template>
  <el-switch class="switch-widget" :disabled="field.readOnly" v-model="switchVal"></el-switch>
</template>

<script>
import WidgetMixin from "./base.mixin";

export default {
  name: "SwitchWidget",
  mixins: [WidgetMixin],
  data() {
    return { switchVal: this.initial.value };
  },
  watch: {
    // switch的深层监听有问题，所以这里要做映射，才可以实现实时更新
    value(newVal) {
      if (newVal !== this.switchVal) {
        this.switchVal = newVal;
      }
    },
    switchVal(newVal) {
      if (newVal !== this.value) {
        this.value = newVal;
      }
    }
  },
  methods: {
    // 定义一个规范化Schema的方法，用来为组件添加个性化的默认属性
    // 对应字段为 field
    defaultSchema() {
      return {
        placeholder: "",
        readOnly: this.form.readOnly
      };
    },
    // 设置获取value时，value值的转换
    toFieldValue(value) {
      return value;
    },
    // 当value变化时设置传递到父组件的value
    fromFieldValue(value) {
      return value;
    },
    // 设置友好值
    getFriendValue(value) {
      return this.enumDict && this.enumDict[value]
        ? this.enumDict[value].text
        : value;
    }
  }
};
</script>

