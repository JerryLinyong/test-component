<template>
  <div>
    <el-button
      v-if="field.chooseAll"
      :disabled="(field.readOnly||(field.readOnly===undefined&&schema.readOnly))"
      :size="field.size"
      :type="value&&value.length===0?'success':null"
      @click="value=[]"
      class="btnItem"
    >{{$t('richform.withoutLimit')}}</el-button>
    <template v-for="option in enumDict">
      <el-button
        :disabled="(field.readOnly||(field.readOnly===undefined&&schema.readOnly))"
        :size="field.size"
        :type="value&&value.includes(option.value)?'success':null"
        :key="option.value"
        @click="pickType(option.value)"
        class="btnItem"
      >{{option.text}}</el-button>
    </template>
  </div>
</template>

<script>
import WidgetMixin from "./base.mixin";
import { difference } from "ramda";
export default {
  name: "SelectBtnWidget",
  mixins: [WidgetMixin],
  methods: {
    // 筛选设备类型和位置
    pickType(type) {
      this.value = this.value.includes(type)
        ? difference(this.value)([type])
        : [...this.value, type];
    },
    // 定义一个规范化Schema的方法，用来为组件添加个性化的默认属性
    defaultSchema() {
      return {
        chooseAll: true,
        size:'small'
      };
    },
    toFieldValue(value) {
      if (!value) {
        if (this.schema.type === "string") {
          return "";
        } else if (this.schema.type === "array") {
          return [];
        } else if (this.schema.type === "object") {
          return {};
        }
      }
      return value;
    }
  }
};
</script>

<style lang="scss" scoped>
.btnItem {
  margin: 2px;
  // height: 36px;
}
</style>
