

<template>
  <!-- :style="{color:valueColor}" -->
  <span>{{ getFriendValue(value) }}</span>
</template>

<script>
import WidgetMixin from "./base.mixin";

export default {
  name: "LabelWidget",
  mixins: [WidgetMixin],
  computed: {},
  data() {
    return {};
  },
  methods: {
    fromFieldValue(value) {
      return value;
    }
  },
  watch: {
    value(newVal) {
      this.valueChanged(newVal);
    }
  }
};
</script>

<style lang="scss">
</style>
