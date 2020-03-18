
<template>
  <el-input-number
    v-model="value"
    :step="field.step"
    @change="handleChange"
    :min="field.min"
    :max="field.max"
    :disabled="disabledFields.includes(field.name)"
  ></el-input-number>
</template>

<script>
import WidgetMixin from "./base.mixin";
import { clone } from "ramda";

export default {
  name: "inputNumberWidget",
  mixins: [WidgetMixin],
  computed: {},
  data() {
    return {
      lastValue: 0
    };
  },
  created() {
    this.lastValue = this.value;
  },
  methods: {
    // 处理输入数据
    handleChange(value) {
      this.value = value;
    },
    // 定义一个规范化Schema的方法，用来为组件添加个性化的默认属性
    defaultSchema() {
      return {
        min: undefined,
        max: undefined,
        step: 1
      };
    },
    // 获取值的转换
    toFieldValue(value) {
      if (typeof value !== "number") {
        return 0;
      } else {
        return value;
      }
    },
    fromFieldValue(value) {
      return value;
    }
  },
  watch: {
    value() {
      // 如果存在模板
      if (Object.keys(this.field).includes("additionTemplate")) {
        let maxIndex = Math.abs(this.value - this.lastValue);
        for (let index = 0; index < maxIndex; index++) {
          if (this.value - this.lastValue > 0) {
            this.field.enumDict.push(clone(this.field.additionTemplate));
          } else {
            this.field.enumDict.pop();
          }
        }
        this.lastValue = this.value;
      }
    }
  }
};
</script>

<style lang="scss">
</style>
