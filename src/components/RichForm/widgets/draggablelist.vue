
<!--
  列表拖动
  数据结构请见 richform/design/tabs.meta.js
-->
<template>
  <dl
    class="draggable-list-widget"
    :readonly="field.readOnly"
    :viewonly="field.viewOnly"
    :size="form.size"
  >
    <draggable v-bind="dragOptions()" :list="value">
      <dd class="draggable-list-row" :key="item.name" v-for="item of value">
        <i :class="['el-icon-s-operation','draggable-list-icon','list-handle-move']"></i>
        <el-input v-model="item.label" />
        <i
          v-show="field.showOperation && item.name !=='1'"
          :class="['el-icon-remove','delete-list-icon']"
          @click="deleteItem(item.name)"
        ></i>
      </dd>
    </draggable>
    <dd v-show="field.showOperation" class="draggable-list-add" @click="addItem">添加标签</dd>
  </dl>
</template>
<script>
import WidgetMixin from "./base.mixin";
import Draggable from "vuedraggable";
import { clone } from "ramda";

export default {
  name: "DraggableListWidget",
  mixins: [WidgetMixin],
  components: { Draggable },
  computed: {},
  data() {
    return {
      autoId: 0, // 自增长ID
      addTemplate: {} // 添加项目模板,以value的首个值
    };
  },
  created() {
    // 深拷贝创建添加模板
    let addTemplate = clone(this.value[0]);
    addTemplate.label = "";
    addTemplate.fields = [];
    this.addTemplate = addTemplate;
    // 自增长ID
    this.autoId = this.value.length;
  },
  methods: {
    // 定义一个规范化Schema的方法，用来为组件添加个性化的默认属性
    defaultSchema() {
      return {
        type: "array",
        widget: "draggablelist",
        title: "操作区域",
        showLabel: false,
        icon: "el-icon-circle-plus", // 添加图标
        showOperation: true // 是否显示操作图标
      };
    },
    // 增加项目
    addItem() {
      this.autoId += 1;
      let addTemplate = clone(this.addTemplate);
      let name = this.autoId.toString();
      addTemplate.name = name;
      this.value.push(addTemplate);
    },
    // 删除项目
    deleteItem(name) {
      let _this = this;
      // 至少要有一个tab
      if (this.value.length === 1) return;
      this.value.map((item, index) => {
        if (item.name === name) {
          _this.$delete(_this.value, index);
        }
      });
    },
    // 拖拽配置
    dragOptions() {
      return {
        animation: 300,
        easing: "cubic-bezier(1, 0, 0, 1)",
        group: {
          name: "draggablelist",
          put: false
        },
        sort: true,
        handle: ".list-handle-move",
        ghostClass: "ghost"
      };
    }
  }
};
</script>

<style lang="scss">
@import "../vars.scss";
.richform {
  .layout {
    .draggable-list-widget {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      .draggable-list-icon,
      .delete-list-icon {
        width: 30px;
        height: 30px;
        line-height: 30px;
        font-size: 25px;
        cursor: pointer;
      }
      .delete-list-icon {
        color: #fbc5c5;
      }
      .delete-list-icon:hover {
        color: #f56c6c;
      }
      .draggable-list-icon {
        color: #c8cbcc;
        cursor: move;
      }
      .draggable-list-row {
        display: flex;
        align-items: center;
        margin: 5px 0;
        .list-handel-move {
          color: #556567;
        }
      }
      .draggable-list-add {
        margin-top: 5px;
        font-size: 14px;
        color: #1890ff;
        cursor: pointer;
      }
    }
  }
}
</style>
