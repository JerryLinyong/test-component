

<template>
  <!-- :style="{color:valueColor}" -->
  <el-input
    class="textbox-widget"
    :readonly="field.readOnly"
    :viewonly="field.viewOnly"
    :size="form.size"
    v-model="value"
    :clearable="field.clearable"
    :placeholder="field.placeholder"
    :maxlength="field.maxLength"
    :minlength="field.minLength"
    :suffix-icon="field.suffixIcon"
    :prifix-icon="field.prifixIcon"
    :show-password="field.password"
    :disabled="disabledFields.includes(field.name)"
    @input="form.validator.on=='input' ? onChange : ''"
    @change="onChange"
  >
    <template slot="prepend" v-if="field.prepend">{{field.prepend}}</template>
    <template slot="append" v-if="field.append">{{field.append}}</template>
  </el-input>
</template>

<script>
import WidgetMixin from "./base.mixin";

export default {
  name: "TextboxWidget",
  mixins: [WidgetMixin],
  computed: {
    valueColor() {
      //console.log(this.field.dictColor[this.value].color)
      return this.field.dictColor &&
        this.field.dictColor[this.value] &&
        this.field.dictColor[this.value].color
        ? this.field.dictColor[this.value].color
        : "#fff";
    }
  },
  data() {
    return {};
  },
  methods: {
    // 定义一个规范化Schema的方法，用来为组件添加个性化的默认属性
    defaultSchema() {
      return {
        placeholder: ""
      };
    },
    toFieldValue(value) {
      if (typeof value == "object") {
        return JSON.stringify(value);
      } else if (typeof value === "boolean") {
        return value + "";
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
      input {
        border: 1px solid $error-color;
        background: transparentize($error-color, 0.8);
      }
    }
  }
}
</style>
