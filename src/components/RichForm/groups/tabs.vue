<!--
    定义tabs组件
-->
<template>
  <!--我增加了一个DIV标签-->
  <div class="richform-tabs">
    <el-tabs
      :class="['tabs-fields',{'active-design-item': design&&tabsItem.isClicked }]"
      @tab-click="onClickedItem(tabsItem)"
      v-model="activeName"
      style="width:100%"
      :editable="form.editable"
      @edit="handleTabsEdit"
    >
      <template v-for="tab in tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <PerfectScrollbar :style="{'min-height':height}">
            <layout
              :values="values"
              :form="form"
              :form-schema="formSchema"
              :fields="tab.fields"
              :design="design"
              :class="{'form-design-perch': design}"
            ></layout>
          </PerfectScrollbar>
        </el-tab-pane>
      </template>
    </el-tabs>
    <!--拖拽-->
    <span v-if="design&&tabsItem.isClicked" class="design-draggable design-handle-move">
      <i class="el-icon-rank design-handle-move"></i>
    </span>
    <!--复制-->
    <span v-if="design&&tabsItem.isClicked" class="design-copy" @click="onCopyItem(tabsItem)">
      <i class="el-icon-document-copy"></i>
    </span>
    <!--删除-->
    <span v-if="design&&tabsItem.isClicked" class="design-delete" @click="onDeleteItem(tabsItem)">
      <i class="el-icon-delete"></i>
    </span>
  </div>
</template>

<script>
import { PerfectScrollbar } from "vue2-perfect-scrollbar";
import DragMixin from "../design/widgets/design.mixin";
import { findIndex, propEq } from "ramda";
import Draggable from "vuedraggable";
export default {
  name: "field_tabs",
  components: { PerfectScrollbar },
  mixins: [DragMixin],
  props: {
    name: { type: String, default: "" }, // 组名称
    values: { type: Object, default: () => ({}) },
    form: { type: Object, default: () => ({}) },
    formSchema: { type: Object, default: () => ({}) },
    icon: { type: String, default: "" }, // 图标
    inline: { type: Boolean, default: true },
    headerStyle: { type: Object, default: () => ({}) },
    expand: { type: Boolean, default: true }, // 是否展开
    title: { type: String, default: "" }, // 组标题，用来显示
    tabs: { type: Array, default: () => [] },
    actions: { type: Array, default: () => [] },
    height: { type: String, default: "30px" },
    design: { type: Boolean, default: false },
    tabsItem: { type: Object, default: () => ({}) } // tabs下的数据，用于定位选中
  },
  beforeCreate: function() {
    this.$options.components.Layout = () => import("../layout.vue");
  },
  data() {
    return { activeName: this.tabs[0] ? this.tabs[0].name : "" };
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    handleTabsEdit(targetName, action) {
      if (action === "add") {
        this.tabs.push({
          label: "新建分组",
          name: "newTab_" + parseInt(Math.random(0, 10) * 1000)
        });
      } else if (action === "remove") {
        let index = findIndex(propEq("name", targetName))(this.tabs);
        this.tabs.splice(index, 1);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.richform-tabs {
  width: 100%;
  position: relative;
  .design-tab-pane {
    min-height: 300px !important;
  }
}
</style>
