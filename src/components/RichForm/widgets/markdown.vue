<!-- 
    markDown 编辑器 
-->
<template>
  <mark-down-editor
    ref="markDownWidget"
    height="250px"
    :language="language"
    :options="options"
    :mode="mode"
    @input="onInput"
  ></mark-down-editor>
</template>

<script>
import MarkDownEditor from "@/components/MarkdownEditor";
import WidgetMixin from "./base.mixin";

export default {
  name: "MarkDownWidget",
  mixins: [WidgetMixin],
  components: {
    MarkDownEditor
  },
  computed: {},
  watch: {
    value(newValue) {
      this.$refs.markDownWidget.setValue(newValue);
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.markDownWidget.setValue(this.value);
      this.isMounted = true;
    });
  },
  data() {
    return {
      language: "zh_CN",
      options: {
        hideModeSwitch: true,
        UsageStatistics: false
      },
      mode: "wysiwyg", // markdown/wysiwyg
      isMounted: false
    };
  },
  methods: {
    toFieldValue(value) {
      return value;
    },
    onInput(value, html) {
      if (this.isMounted) {
        this.value = value;
      }
    }
  }
};
</script>

