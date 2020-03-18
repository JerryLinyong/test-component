
<template>
  <div>
    <el-radio
      v-if="field.chooseAll"
      v-model="value"
      :disabled="(field.readOnly)"
      :label="$t('richform.withoutLimit')"
    >{{$t('richform.withoutLimit')}}</el-radio>
    <template v-for="option in enumDict">
      <el-radio
        v-model="value"
        :disabled="(value!==option.value&&field.readOnly)"
        :label="option.value"
        :key="option.value"
      >{{option.text}}</el-radio>
    </template>
  </div>
</template>

<script>
import WidgetMixin from "./base.mixin";
export default {
  name: "RadioWidget",
  mixins: [WidgetMixin],
  methods: {
    // 定义一个规范化Schema的方法，用来为组件添加个性化的默认属性
    defaultSchema() {
      return {
        chooseAll: true
      };
    },
    toFieldValue(value) {
      if (this.field.chooseAll && !value) {
        return "all";
      } else {
        return value;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
