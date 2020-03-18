
<template>
  <el-date-picker
    v-model="value"
    :disabled="field.readOnly||form.readOnly"
    type="date"
    :placeholder="field.placeholder"
    @change="dataChange"
  ></el-date-picker>
</template>

<script>
import mixin from "./base.mixin";
import dayjs from "dayjs";
export default {
  name: "DataPickerWidget",
  mixins: [mixin],
  watch: {
    value(newVal) {
      if (!newVal && this.field.countAge) {
        this.$set(this.values, "age", null);
      }
    }
  },
  mounted() {
    // 同步年龄和岁数
    if (this.value) {
      this.dataChange(this.value);
    }
  },
  methods: {
    // 选择日期改变时
    dataChange(value) {
      if (this.field.countAge) {
        let age = dayjs().diff(dayjs(value), "year");
        if (!age && age != 0) {
          age = null;
        }
        this.$set(this.values, "age", age);
      }
    },
    // 定义一个规范化Schema的方法，用来为组件添加个性化的默认属性
    // 对应字段为 field
    defaultSchema() {
      return {
        placeholder: "",
        countAge: false,
        readOnly: false
      };
    },
    // 设置获取value时，value值的转换
    toFieldValue(value) {
      return value;
    },
    // 当value变化时设置传递到父组件的value
    fromFieldValue(value) {
      if (value) {
        return dayjs(value).valueOf();
      }
      return value;
    },
    // 设置友好值
    getFriendValue(value) {
      if (value) {
        return dayjs(value).format("YYYY MM-DD");
      }
      return value;
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
