<!--
  field.treeName 传入导航树
!-->
<template>
  <div class="selectpro-widget">
    <el-popover v-model="visible" placement="bottom-start" trigger="click">
      <PerfectScrollbar>
        <Navigation
          ref="selectProNav"
          :name="field.treeName || 'default'"
          :show-menubar="field.showMenubar"
          :checkable="field.checkable"
          :editable="field.editable"
          :deletable="field.deletable"
          :addable="field.addable"
          :multi-select="field.multiSelect"
          :is-load-lastest-tree="field.isLoadLastestTree"
          :show-context-menu="field.showContextMenu"
          :style="field.defaultStyle"
          @selectedChange="getSelectedItems"
          @nodeclick="onTreeNodeClick"
          @nodedblclick="handleNodedblclick"
          @ready="onready"
        />
      </PerfectScrollbar>
      <div slot="reference" class="selectpro-el-tags-box">
        <el-input type="textarea" class="selectpro-input" :rows="inputRows" />
        <div class="select-tags">
          <el-tag
            v-for="item in value"
            :key="item.id"
            class="select-tag"
            closable
            @close="tagsClose(item.id)"
          >{{ item.title }}</el-tag>
        </div>
      </div>
    </el-popover>
  </div>
</template>

<script>
import Navigation from '@/common/ResourceManage/Navigation'
import { PerfectScrollbar } from 'vue2-perfect-scrollbar'
import mixin from './base.mixin'
import JSONPath from 'jsonpath'
import { is, isEmpty } from 'ramda'

export default {
  name: 'SelectPro',
  components: {
    Navigation,
    PerfectScrollbar
  },
  mixins: [mixin],
  data() {
    return {
      selectItems: [],
      title: '',
      visible: false,
      inputRows: 1 // 输入框行高, 默认高度为 1 行行高
    }
  },
  computed: {},
  watch: {
    value(newVal) {
      // 当组件的值被清空时,也同步清空资源树选中的值
      if ([null, undefined].includes(newVal) || isEmpty(newVal)) {
        this.$refs.selectProNav.clearSelects()
      }
      // 计算输入框高度
      if (newVal && newVal.length > 0) {
        const tagWigth = $('.select-tag').outerWidth(true)
          ? $('.select-tag').outerWidth(true)
          : 92 // 获取content+padding+border+margin的宽度
        const inputWidth = $('.selectpro-input').width() // 只是获取content宽度
        const tagsRowNum = Math.floor(inputWidth / tagWigth) // 一行输入框可以存放的 tag 数目
        this.inputRows = Math.ceil(newVal.length / tagsRowNum)
      } else {
        this.inputRows = 1
      }
    }
  },
  methods: {
    // 字段默认值
    defaultSchema() {
      return {
        value: '',
        showMenubar: false,
        checkable: true,
        editable: false,
        deletable: false,
        addable: false,
        multiSelect: true,
        onlyLeaf: true,
        showContextMenu: false,
        defaultStyle: { width: '250px', height: '350px' },
        isLoadLastestTree: false
      }
    },
    // 要显示的值，array形式
    toFieldValue(value) {
      return this.getSelectNodeData(value)
    },
    // 发送到后端的值，统一变成字符串
    fromFieldValue(value) {
      // if (typeof value === "object") {
      //   if (Array.isArray(value)) {
      //     return value.join(",");
      //   }
      //   return value.id;
      // }
      if (is(Array, value)) {
        // value = ['xxxx_xxx_xx']
        if (is(String, value[0])) {
          return value.join(',')
        }
        // value = [{id: 'xxx_xxx_xxx'}]
        return value.map(val => val.id).join(',')
      }
      if (is(Object, value)) {
        console.log('aaa')
        return value.id
      }

      return value
    },
    // 显示在筛选栏上的友好值，变成字符串
    getFriendValue(value) {
      return this.getSelectNodeData(value)
        .map(node => node.title)
        .join(',')
    },
    onready() {
      this.updateValue++
    },
    // 获取选中的node的数据，返回一个数组
    getSelectNodeData(value) {
      if (!this.$refs.selectProNav || !this.$refs.selectProNav.navigator[0]) {
        // 当dom未加载时,返回空数组
        return []
      }
      let showedValue = []
      // 如果值是字符串则变成数组
      if (typeof value === 'string' && value) {
        // 判断是否是多选节点, 例 'xxx_xxx_xxx1,xxx_xxx_xxx2'
        if (value.indexOf(',') > -1) {
          showedValue = value.split(',')
        } else {
          showedValue.push(value)
        }
      }
      // 如果值是对象,则变成数组
      if (typeof value === 'object' && !Array.isArray(value)) {
        showedValue = [value.id]
      }
      if (!showedValue) return
      const nodeData = []
      showedValue.forEach(nodeId => {
        const node = this.$refs.selectProNav.$refs.navTree.getNode(nodeId)
        if (node) {
          nodeData.push(node.data)
        }
      })
      return nodeData
    },
    // 如果是单选,则返回对象
    onTreeNodeClick({ id, title }, node) {
      if ((this.field.onlyLeaf && !node.isLeaf) || this.field.checkable) return
      this.value = {
        id,
        title
      }
      this.visible = false
    },
    handleNodedblclick() {
      // 预留
    },
    // 如果是多选，则返回数组
    getSelectedItems(nodes) {
      this.value = nodes
    },
    // 关闭tag
    tagsClose(nodeId) {
      this.$refs.selectProNav.$refs.navTree.setChecked(nodeId, false) // 调用navTree组件的内部方法,同步选中项
      this.value = this.$refs.selectProNav.$refs.navTree.getCheckedKeys() // 修改value值
    }
  }
}
</script>

<style lang="scss">
.selectpro-widget {
  .selectpro-el-tags-box {
    min-height: 35px;
    .selectpro-input {
      font-size: 16px;
    }
    .select-tags {
      top: 0px;
      position: absolute;
      display: flex;
      z-index: 100;
      flex-wrap: wrap;
      height: 36px;
      padding: 4px 15px;
      .select-tag {
        height: 23px;
        line-height: 22px;
        margin: auto 2px;
        margin-top: 1px;
        margin-bottom: 1px;
      }
    }
  }
}
</style>
