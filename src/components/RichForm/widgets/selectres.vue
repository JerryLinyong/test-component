<!-- 
    资源选择器
    用于功能配置页面 资源管理页面 
 -->
<template>
  <div class="selectres-widget">
    <el-popover placement="bottom-start" trigger="click" v-model="visible">
      <PerfectScrollbar class="res-dropdown-scrollbar">
        <ResourceSelect
          style="width:261px"
          ref="selectresTree"
          layout="right"
          :checkable="true"
          checkLeafOnly
          :isShowBar="false"
          :showFilterbar="false"
          loadedResTypes="patient,doctor,nurse,medicalAdvice,medicalExpense,medicineTakingRecord,organ,area,room,bed"
          :lazy="false"
          @checkNode="onCheckNode"
          @emitTreeData="emitTreeData"
        />
      </PerfectScrollbar>
      <div slot="reference" class="selectres-el-tags-box">
        <el-tag
          class="select-tag"
          :key="item.treeNodeId"
          closable
          v-for="item in currentCheckedNodes"
          @close="tagsClose(item.treeNodeId)"
        >{{ item.title }}</el-tag>
        <i v-show="currentCheckedNodes.length" class="el-icon-circle-close" @click="clearTag"></i>
      </div>
    </el-popover>
  </div>
</template>

<script>
import ResourceSelect from "@/common/ResourceManage/ResourceSelect";
import mixin from "./base.mixin";
import { clone } from "ramda";

export default {
  name: "SelectRes",
  mixins: [mixin],
  components: {
    ResourceSelect
  },
  data() {
    return {
      checkedNodesArr: [],
      allTreeData: [],
      visible: false
    };
  },
  watch: {
    value() {
      this.synchronousData();
    },
    checkedNodesArr() {
      // 传递给默认勾选组件
      this.$set(this.values, "checkedNodes", this.checkedNodesArr);
      let idArr = [];
      this.checkedNodesArr.forEach(node => {
        idArr.push(node.id);
      });
      // 赋值给value
      this.value = idArr.join(",");
    }
  },
  created() {},
  computed: {
    currentCheckedNodes() {
      return this.checkedNodesArr;
    }
  },
  mounted() {},
  methods: {
    // 在这里渲染默认数据 和拿到所有节点的数据  在每次表单重新渲染时触发
    emitTreeData(data) {
      this.allTreeData = data;
      this.synchronousData();
    },

    synchronousData() {
      // 如果不存在显示类型 或者显示类型为空时 标签为空 树节点为空
      if (!this.values.resTypeNames || this.values.resTypeNames === "") {
        if (this.values.resTypeNames === "") {
          this.checkedNodesArr = [];
          this.$refs.selectresTree.$refs.resTree.setCheckedKeys([]);
        } else {
          this.checkedNodesArr = [];
          let treeNodeIdArr = [];
          // 如果不存在此属性 就显示默认的
          if (typeof this.schema.default === "string") {
            this.schema.default.split(",").forEach(id => {
              this.allTreeData.forEach(item => {
                if (id === item.id) {
                  this.checkedNodesArr.push(item);
                  treeNodeIdArr.push(item.treeNodeId);
                }
              });
            });
            this.$refs.selectresTree.$refs.resTree.setCheckedKeys(
              treeNodeIdArr
            );
            this.$set(this.values, "checkedNodes", this.checkedNodesArr);
          }
        }
      } else {
        // 渲染对应的标签 和 节点
        this.checkedNodesArr = [];
        let treeNodeIdArr = [];
        if (typeof this.schema.default === "string") {
          this.values.resTypeNames.split(",").forEach(id => {
            this.allTreeData.forEach(item => {
              if (id === item.id) {
                this.checkedNodesArr.push(item);
                treeNodeIdArr.push(item.treeNodeId);
              }
            });
          });
          this.$refs.selectresTree.$refs.resTree.setCheckedKeys(treeNodeIdArr);
        }
      }
      // 传递给选择默认选中的数据 和当前选中的同步
      this.$set(this.values, "checkedNodes", this.checkedNodesArr);
    },
    // 点击单选框时 拿到树上最新的数据 同步选中的标签
    onCheckNode() {
      this.checkedNodesArr = this.$refs.selectresTree.$refs.resTree.getCheckedNodes();
    },
    // 清空选中
    clearTag() {
      this.checkedNodesArr.forEach(node => {
        this.$refs.selectresTree.$refs.resTree.setChecked(
          node.treeNodeId,
          false
        );
      });
      this.checkedNodesArr = [];
    },
    // 关闭tag
    tagsClose(treeNodeId) {
      this.$refs.selectresTree.$refs.resTree.setChecked(treeNodeId, false);
      this.checkedNodesArr.forEach((node, index) => {
        if (node.treeNodeId === treeNodeId) {
          this.checkedNodesArr.splice(index, 1);
        }
      });
    },
    toFieldValue(value) {
      return value;
    }
  }
};
</script>


<style lang="scss">
.selectres-widget {
  .selectres-el-tags-box {
    display: flex;
    flex-wrap: wrap;
    min-height: 36px;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    padding: 4px 20px 0px 4px;
    position: relative;
    transition: 0.3s;
    &:hover {
      border: 1px solid #ccc;
    }
    .select-tag {
      margin: 0 4px 4px 0;
    }
    .el-icon-circle-close {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      right: 10px;
      color: #ccc;
      cursor: pointer;
    }
  }
}
.res-dropdown-scrollbar {
  max-height: 400px;
}
</style>
