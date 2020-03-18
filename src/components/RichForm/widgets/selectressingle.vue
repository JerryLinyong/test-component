<!-- 
    资源选择器 从多选中单选一个
    用于功能配置页面 资源管理页面 
 -->
<template>
  <div class="selectres-single-widget">
    <el-select
      v-model="selectValue"
      clearable
      class="selectres-single-select"
      placeholder
      @focus="onFocus"
      @change="onChange"
    >
      <el-option
        v-for="item in options"
        :key="item.treeNodeId"
        :value="item.id"
        :label="item.title"
      ></el-option>
    </el-select>
  </div>
</template>

<script>
import mixin from "./base.mixin";

export default {
  name: "SelectResSingle",
  mixins: [mixin],
  components: {},
  data() {
    return {
      options: [],
      selectValue: ""
    };
  },
  watch: {
    value() {
      this.synchronousData();
    },
    values: {
      handler() {
        this.synchronousData();
        // 在修改的过程中如果把默认选中的资源删除 就把默认选中设为空
        if (this.values.defaultClickItem) {
          let idArr = [];
          if (this.values.checkedNodes) {
            this.values.checkedNodes.forEach(item => {
              idArr.push(item.id);
            });

            if (!idArr.includes(this.values.defaultClickItem)) {
              this.value = "";
            }
          }
        }
      },
      deep: true
    }
  },
  computed: {},
  mounted() {
    this.synchronousData();
  },
  methods: {
    toFieldValue(value) {
      return value;
    },
    onFocus() {
      if (this.values.checkedNodes) {
        this.options = this.values.checkedNodes;
      }
    },
    onChange(value) {
      this.value = value;
    },
    synchronousData() {
      if (
        !this.values.defaultClickItem ||
        this.values.defaultClickItem === ""
      ) {
        if (this.values.defaultClickItem === "") {
          this.selectValue = "";
        } else {
          this.value = this.schema.default;
        }
      } else {
        if (this.values.checkedNodes) {
          this.values.checkedNodes.forEach(item => {
            if (item.id === this.values.defaultClickItem) {
              this.selectValue = item.title;
            }
          });
        }
      }
    }
  }
};
</script>


<style lang="scss">
.selectres-single-widget {
  .selectres-single-select {
    width: 100%;
  }
}
</style>
