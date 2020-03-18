<!--  
    默认简单分组
    
-->
<template>
  <div
    :class="['group',{'active-design-item': design&&groupItem.isClicked },{'design-dashed': design}]"
    :name="name"
    :style="{}"
  >
    <!-- 删栏布局全局选中区域 -->
    <i
      v-show="!title&&design&&Object.keys(groupItem).includes('designId')"
      class="grid-clicked-area el-icon-top-left"
      @click="onClickedItem(groupItem)"
    ></i>
    <div
      class="header vborder-1 bottom"
      @click="toggle"
      v-if="title"
      :style="headerStyle ? headerStyle : {}"
    >
      <span class="title" :style="{color:theme}" @click="onClickedItem(groupItem)">
        <svg-icon v-if="icon" :icon-class="icon"></svg-icon>
        {{ title }}
      </span>
      <!-- 顶部工具按钮 -->
      <form-actions v-if="topActions.length>0" :actions="topActions" :form="form"></form-actions>
      <i :class="isExpand ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
    </div>
    <layout
      :fields="fields"
      @mounted="onLayoutMounted"
      :form="form"
      :form-schema="formSchema"
      :values="values"
      :options="layoutOptions"
      :design="design"
      :class="{
                inline:inline,
                wrap:inline && wrap,
                'form-design-perch': design
            }"
    ></layout>
    <form-actions v-if="bottomActions.length>0" :actions="bottomActions" :form="form"></form-actions>
    <!--拖拽-->
    <span v-if="design&&groupItem.isClicked" class="design-draggable design-handle-move">
      <i class="el-icon-rank design-handle-move"></i>
    </span>
    <!--复制-->
    <span v-if="design&&groupItem.isClicked" class="design-copy" @click="onCopyItem(groupItem)">
      <i class="el-icon-document-copy"></i>
    </span>
    <!--删除-->
    <span v-if="design&&groupItem.isClicked" class="design-delete" @click="onDeleteItem(groupItem)">
      <i class="el-icon-delete"></i>
    </span>
  </div>
</template>

<script>
import { get } from "vuex-pathify";
import FormActions from "../actions";
import eventbus, { RichFormHeaderIconClick } from "@/eventbus";
import DragMixin from "../design/widgets/design.mixin";

export default {
  name: "FieldGroup",
  components: { FormActions },
  mixins: [DragMixin],
  props: {
    name: String, // 组名称
    values: { type: Object, default: () => {} },
    form: { type: Object, default: () => {} },
    formSchema: { type: Object, default: () => {} },
    icon: String, // 图标
    inline: Boolean,
    wrap: Boolean,
    grow: Number,
    labelWidth: String, // 覆盖全局的labelWidth
    headerStyle: Object,
    expand: { type: Boolean, default: true }, // 是否展开
    title: String, // 组标题，用来显示
    fields: { type: Array, default: () => [] },
    actions: { type: Array, default: () => [] },
    design: { type: Boolean, default: false }, // 开启设计模式
    groupItem: { type: Object, default: () => ({}) }
  },
  computed: {
    isLighgt: get("my/light"),
    theme: get("my/theme"),
    layoutOptions: function() {
      return {
        labelWidth: this.labelWidth
      };
    },
    topActions: function() {
      return this.actions.filter(action => action.at == "top");
    },
    bottomActions: function() {
      return this.actions.filter(action => action.at != "top");
    }
  },
  data() {
    return {
      isExpand: true
    };
  },
  beforeCreate: function() {
    this.$options.components.Layout = () => import("../layout.vue");
  },
  mounted() {},
  methods: {
    onLayoutMounted() {
      if (this.expand === false) {
        this.toggle();
      }
    },
    //展开或折叠分组内容
    toggle() {
      $(this.$el)
        .children(".layout")
        .slideToggle("fast", () => {
          this.isExpand = !this.isExpand;
        });
    }
  }
};
</script>

<style lang="scss">
.group {
  position: relative;
  .grid-clicked-area {
    display: inline-block;
    width: 27px;
    height: 20px;
    line-height: 20px;
    position: absolute;
    left: 3px;
    bottom: 3px;
    box-sizing: border-box;
    z-index: 99;
    background: #fff;
    cursor: pointer;
    text-align: center;
    color: #f00;
  }
}
</style>
