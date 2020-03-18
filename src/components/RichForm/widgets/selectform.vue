<!-- 
    表单选择器 单选可搜索
 -->
<template>
  <div class="select-form-widget">
    <el-select
      v-model="selectValue"
      value-key="formUrl"
      filterable
      clearable
      class="select-form-select"
      placeholder="请选择"
      @change="onChange"
    >
      <el-option
        v-for="(item, index) in options"
        :key="index"
        :label="item.label"
        :value="item.value"
      ></el-option>
    </el-select>
  </div>
</template>

<script>
import mixin from "./base.mixin";

export default {
  name: "SelectForm",
  mixins: [mixin],
  components: {},
  data() {
    return {
      options: [
        {
          value: {
            formUrl: `/resourcetypes/callRecord/meta?category=forms.filter_callRecord`,
            schemaUrl: `/resourcetypes/callRecord/meta?category=attrs`
          },
          label: "表单1"
        },
        {
          value: {
            formUrl: "/resourcetypes/event/meta?category=forms.view_transaction_event",
            schemaUrl: `/resourcetypes/event/meta?category=attrs`
          },
          label: "表单2"
        }
      ],
      selectValue: ""
    };
  },
  watch: {},
  computed: {},
  mounted() {},
  methods: {
    toFieldValue(value) {
      return value;
    },
    onChange(value) {
      this.value = value;
    }
  }
};
</script>


<style lang="scss">
.select-form-widget {
  .select-form-select {
    width: 100%;
  }
}
</style>
