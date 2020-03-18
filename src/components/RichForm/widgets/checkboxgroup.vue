<template>
  <el-checkbox-group v-model="value">
    <el-checkbox
      :disabled="field.readOnly"
      :label="option.value"
      v-for="option in enumDict"
      :key="option.value"
    ></el-checkbox>
  </el-checkbox-group>
</template>

<script>
import mixin from "./base.mixin";
export default {
  name: "CheckboxGroupWidget",
  mixins: [mixin],
  methods: {
    // 定义一个规范化Schema的方法，用来为组件添加个性化的默认属性
    // 对应字段为 field
    defaultSchema() {
      return {
        placeholder: "",
        readOnly: false
      };
    },
    // 设置获取value时，value值的转换
    toFieldValue(value) {
      console.log(value)
      return value;
    },
    // 当value变化时设置传递到父组件的value
    fromFieldValue(value) {
      console.log(value)
      return value;
    },
    // 设置友好值
    getFriendValue(value) {
      console.log(value)
      return value;
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
