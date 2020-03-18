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
  title: "", //一般用于显示
  widget: "button", // 可选，推荐的表单渲染组件名称
  readOnly: false // 是否只读
}
-->

<template>
	<el-button 
    :type="field.type?field.type:'default'" 
    v-if="!field.readOnly"
    :style="field.style"
  >
  {{schema.title}}</el-button>
</template>

<script>
import mixin from "./base.mixin";
export default {
	name: "BbuttonWidget",
  mixins: [mixin],
  data(){
    return{}
  },
  methods:{}
};
</script>

<style lang="scss" scoped>
</style>
