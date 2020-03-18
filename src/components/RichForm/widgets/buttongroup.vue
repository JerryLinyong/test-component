<!--
layout传入的参数
{
  name: "button", // 对应的schema键值,必选,唯一
  flexGrow: 1,
  action: ()=>{},
}

对应schema的参数
{ 
  name: "button", // 名称,与key相同
  title: "GAGA", //一般用于显示
  widget: "button", // 可选，推荐的表单渲染组件名称
  readOnly: false // 是否只读
}
-->

<template>
  <el-button-group v-if="!field.readOnly" v-model="value">
    <el-button
      v-for="option in enumDict"
      :value="option.value"
      :key="option.id"
      :size="field.size"
      :type="option.value == value ? 'primary' : ''"
      @click="handleClickEvent(option.value)"
    >{{option.text?option.text:option.name}}</el-button>
  </el-button-group>
</template>

<script>
import mixin from "./base.mixin";
import { sync } from "vuex-pathify";
export default {
  name: "ButtonGroupWidget",
  mixins: [mixin],
  data(){
    return{
    } 
  },
  computed: {
		// defaultSize: sync("my/layoutSize")
	},
  methods: {
    handleClickEvent(value){
      this.value = value
		},
    defaultSchema() {
      return {
        readOnly: false,
        size:"mini"
      };
    },
    // 设置获取value时，value值的转换
    toFieldValue(value) {
      return value;
    },
    // 当value变化时设置传递到父组件的value
    fromFieldValue(value) {
      return value;
    },
    // 设置友好值
    getFriendValue(value) {
      return value;
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
