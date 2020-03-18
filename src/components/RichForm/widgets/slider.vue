<template>
  <!--  在richform里的schema中定义样式
  value中定义值-->
  <el-slider
    class="richform_slider"
    v-model="value"
    :min="field.minimum"
    :max="field.maximum"
    :step="field.step"
    :format-tooltip="formatTooltip"
    :show-stops="!field.showStop===false"
    :show-input="field.showInput===true"
    :range="field.showRange===false"
    :disabled="field.readOnly"
  ></el-slider>
</template>

<script>
import mixin from "./base.mixin";
export default {
  name: "SliderWidget",
  mixins: [mixin],
  data() {
    return { startInput: false };
  },
  async mounted() {
    await this.$nextTick();
    // slider初始化时改变了value值，进而改变了脏值
    this.startInput = true;
  },
  methods: {
    // value值改变触发的事件
    valueChanged(value) {
      if (!this.startInput) return;
      try {
        const v = this.fromFieldValue(value);
        const friendValue = this.getFriendValue(v);
        this.$emit("change", v, friendValue, this.getExtraData());
      } catch (e) {
        logger.warn(
          this.$t("richform.setValueErr").params(this.schema.name, e.message)
        );
      }
    },
    // 定义一个规范化Schema的方法，用来为组件添加个性化的默认属性
    defaultSchema() {
      return {
        step: 10, // 步长
        minimum: 0, // 最小值
        maximum: 100, // 最大值
        readOnly: false,
        showStop: false,
        showInput: true,
        showRange: true
      };
    },
    formatTooltip(val) {
      return val;
    },
    toFieldValue(value) {
      if (this.form.showInput === false) {
        if (Array.isArray(value)) {
          return value.map(range => parseInt(range));
        } else {
          return value.split(",").map(range => parseInt(range));
        }
      } else {
        return parseInt(value);
      }
    },
    fromFieldValue(value) {
      if (this.schema.type === "string") {
        if (Array.isArray(value)) {
          return value.join(",");
        } else {
          return value + "";
        }
      } else {
        return value;
      }
    }
  }
};
</script>

<style lang="scss">
.richform_slider {
  padding-left: 10px;
  padding-right: 30px;
}
</style>
