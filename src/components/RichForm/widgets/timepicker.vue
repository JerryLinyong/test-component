
<template>
  <el-time-picker v-model="value" :readonly="field.readOnly" :placeholder="field.placeholder"></el-time-picker>
</template>

<script>
import mixin from "./base.mixin";
import dayjs from "dayjs";
export default {
  name: "TimePickerWidget",
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
      return value;
    },
    // 当value变化时设置传递到父组件的value
    fromFieldValue(value) {
      return value;
    },
    // 设置友好值
    getFriendValue(value) {
      return dayjs(value).format("YYYY-MM-DD HH:mm:ss");
    },
    created() {
      if (this.field.initDate) {
       this.value = new Date()
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
