<!--
    树的数据绑定在schema的treeSource，value绑定选中树的值
    name: {
        type: "array",
        title: "数据模型",
        widget: "tree",
        inline: false,
        checkType: "radio", // radio返回字符串 multi返回数组 leaf单选尾节点
        callbackField: [""],// 需要返回的字段
        treeSource: []
    },
-->
<template>
  <el-popover placement="right" title="数据模型" width="200" trigger="hover">
    <el-tree
      v-show="field.treeSource!=='undefined'&&field.treeSource.length>0"
      :data="field.treeSource"
      :node-key="field.treeKey"
      :highlight-current="field.isHighlight"
      :props="defaultProps"
      default-expand-all
      @node-click="onHandleClickNode"
      ref="treeselect"
    ></el-tree>
    <el-button slot="reference">{{ clickedLable || "请选择" }}</el-button>
  </el-popover>
</template>
<script>
import WidgetMixin from "./base.mixin";

export default {
  name: "TreeSelectWidget",
  mixins: [WidgetMixin],
  computed: {},
  data() {
    return {
      defaultProps: {
        label: "title",
        isHighlight: false, // 是否高亮
        callbackField: [], // 需要返回的字段
        checkType: "radio", // radio单选 multi返回数组 leaf单选尾节点
        treeSource: [] // 数源
      },
      clickedLable: ""
    };
  },
  mounted() {
    this.$nextTick(function() {
      if (this.value.length > 0) {
        let allParents = this.value.split(".");
        let currentName = allParents[allParents.length - 1];
        this.$refs.treeselect.setCurrentKey(currentName); // 树设置高亮
        this.onKeysGettingTitle(this.field.treeSource, allParents);
      }
    });
  },
  methods: {
    // 树点击
    onHandleClickNode(clickItem, nodeData) {
      let allParentKey = this.onFindAllParentKey(nodeData);
      this.value = allParentKey;
      this.clickedLable = clickItem.title;
    },
    // 根据keys去查找标题
    onKeysGettingTitle(source, keys = [], index = 0) {
      for (let key in source) {
        if (typeof source[key] === "object") {
          if (source[key].name === keys[index] && keys.length - 1 >= index) {
            if (keys.length - 1 === index) {
              this.clickedLable = source[key].title;
              return;
            }
            index += 1;
          }
          this.onKeysGettingTitle(source[key], keys, index);
        }
      }
    }
  }
};
</script>

<style lang="scss">
@import "../vars.scss";
.richform {
  .layout {
  }
}
</style>
