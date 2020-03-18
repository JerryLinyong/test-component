

<template>
  <div>
    <el-dropdown
      class="dropdown-widget"
      :readonly="field.readOnly"
      :size="form.size"
      :disabled="disabledFields.includes(field.name)"
      @command="handleSelectChange"
    >
      <span class="el-dropdown-link">
        {{enumDict&&typeof enumDict==='object'&&enumDict[value]?enumDict[value].text:$t('richform.noChoose')}}
        <i
          class="el-icon-arrow-down el-icon--right"
        ></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item v-if="field.chooseAll" command="all">{{$t('richform.withoutLimit')}}</el-dropdown-item>
        <el-dropdown-item
          v-for="item in enumDict"
          :key="item.value"
          :command="item.value"
        >{{item.text}}</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import WidgetMixin from "./base.mixin";

export default {
  name: "DropdownWidget",
  mixins: [WidgetMixin],
  computed: {},
  data() {
    return {};
  },
  methods: {
    handleSelectChange(item) {
      if (item === "all") {
        this.value = undefined;
      } else {
        this.value = item;
      }
    },
    // 定义一个规范化Schema的方法，用来为组件添加个性化的默认属性
    defaultSchema() {
      return { 
        isNeedValidate: false,
        chooseAll: false
      };
    },
    toFieldValue(value) {
      if (typeof value == "object") {
        return JSON.stringify(value);
      } else {
        return value;
      }
    }
  }
};
</script>

<style lang="scss">
@import "../vars.scss";

.richform {
  .layout {
    .field.error {
    }
  }
}
</style>
