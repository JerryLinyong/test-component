
<template>
  <div>
    <ipInput
      class="textbox-widget"
      :readonly="field.readOnly"
      :ip="value"
      :placeholder="field.placeholder"
      :on-change="onIpChange"
    ></ipInput>
    <template slot="prepend" v-if="field.prepend">{{field.prepend}}</template>
    <template slot="append" v-if="field.append">{{field.append}}</template>
  </div>
</template>

<script>
import WidgetMixin from "./base.mixin";
import ipInput from "@/components/IpInput";

export default {
  name: "IpInputWidget",
  mixins: [WidgetMixin],
  components: { ipInput },
  computed: {},
  data() {
    return {};
  },
  methods: {
    onIpChange(val) {
      this.value = val;
    },
    // 定义一个规范化Schema的方法，用来为组件添加个性化的默认属性
    defaultSchema() {
      return {
        placeholder: "",
        prepend: null, //前置内容
        append: null //后置内容
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
      input {
        border: 1px solid $error-color;
        background: transparentize($error-color, 0.8);
      }
    }
  }
}
</style>


</style>
