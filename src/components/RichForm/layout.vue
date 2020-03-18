<!-- 通用表单组件

    1. 快速入门
    import RichForm from "@/components/RichForm"
    <rich-form
            :url="/deviceee/sassform.json  <从该url加载表单布局>"
            :form="表单的定义数据"                
            :values="<表单初始值>"        
            :schema="<表单元数据> JSON Schema来描述"
            :view="<表单显示模式>"      // 0-正常，1-显示
            @submit="<当提供表单时触发此事件>"
            @change="<当>"    
        ></rich-form>


    2. 表单数据 JSON Schema描述
      采用JSON Schema描述表单各个字段的规格

    3. 描述表单结构

    form={
        name             : ""              // 表单英文名称
        url              : ""              // 提交的url
        submit           : "ajax",         // 表单提交方式,default:以默认向url地址提交;ajax:以AJAX方式提交表单
        enabled          : true,           // 表单使能状态，默认true
        border           : true,           // 显示边框
        size             : "",             // 表单的尺寸，取值large,medium,small，默认为medium
        fit              : false,          // 自动充满容器
        readOnly         : false,          // 只读状态，不允许提交
        labelSuffix      : true            // 字段标题后缀内容，默认' : '
        inline           : false,          // 字段标题显示位置, 默认true左侧left,false显示在top上方
        hideAdvanced     : false,          // 隐藏高级选项
        labelWidth       : "auto",         // 标签宽度,可选px值
        labelAlign       : "left"          // 标签对齐, 默认左对齐, 可选右对齐
        compact          : true            // 紧凑模式，字段之间的距离更小些,表头更小些等
        method           : "get"           // 提交方法,get,post
        enctype          : ""              // 当需要上传文件时，自动置为multipart/form-data
        history:{            显示表单字段输入历史配置
            enabled:true     开启这项功能
            storage:"local"  历史存储方式,local=本地存储,remote=存储在远程服务器 
            key:""           本地存储时所使用的key, field=使用字段名称,form=使用表单名称,url:使用访问url进行hash
        },
        validator :{
            on:'',  //什么时候对字段值进行验证，once-在输入时马上验证，submit-当提交时进行验证,none=不验证
        },
        actions: [   //声明显示在下方和动作按钮
            {
                name: "",                 // 按键的唯一标识符
                type: "primary"           // 按键类型,默认为primary
                title: "提交",            // 按键的文字
                icon: "",                 // 按键图标
                right:false,              // 如果=true，则显示在右侧
                visible: true,            // 按键是否可见,同时满足readonly===false和设置为true才会显示,默认为true
                tips: "提示信息",          // 鼠标悬浮在按键的提示信息
            }
        ]
        layout:
            // 每个字段使用一个{}描述
            {
                widget:"",               // 可选的，字段的渲染默认由schema里面的widget值决定，如果此处提供则使用
                name:"字段名称",          // 字段名称，必须在schema里面具有对应的定义，否则不能校验
                flexGrow: 1,             // 占据行多余的空间的比例，默认为均为1
                advanced: true,          // 是否是高级选项,默认false
                showHelp: true,          // 是否显示一个图标,默认false，=true时会显示schema中的help
                showLabel: true,         // 是否显示标签,默认true
                inline:'auto'            // 是否标签与内容显示在同一行
                width:'',                // 额外的宽度
                style:{}                 // 额外的
            }
            // 多个字段要显示在一行，只需要使用一个[]包含即可
            [
                {....},
                {....}
            ], 
            // 显示一个标题的分组
            {
                widget:"group",
                name:"",                 // 组名称             
                title:"",
                fields:[
                    {...},{...}
                ]
            },
            { 
                widget:"tabs",
                actions:[],             // 用来显示tabs底部按钮
                height: '300px', // tab 内容的高度，默认300px
                tabs:[                 // 每一个tab包含的内容
                    {                    // 一个对象表示一个tab
                    label: "",         // tab名称
                    name: "",          // tab的key
                    columns: [],       // tab的列
                    }                  
                ]
                }
            // 显示为一条水平分割线
            "-",                   
            // 以<开头的内容则视为HTML，直接渲染到表单中        
            "<"                            
        }   
-->
<template>
  <!-- <div class="layout"> -->
  <draggable
    :class="['layout',{'drag-design':design}]"
    v-bind="getDragOptions()"
    :list="fields"
    tag="div"
  >
    <!-- 表单内容，每一项表示一行 -->
    <template v-for="(item,index) in fields">
      <!-- 当为数组时,每一项表示一列 -->
      <template v-if="Array.isArray(item)">
        <field-group
          :key="index"
          :values="values"
          :form="form"
          :form-schema="formSchema"
          :fields="item"
          :design="design"
        />
      </template>
      <!-- 当为对象时，显示group样式 -->
      <template v-else-if="typeof(item) == 'object' && item.widget =='group'">
        <field-group
          v-if="item.visible!=false"
          :key="index"
          :values="values"
          :form="form"
          :form-schema="formSchema"
          v-bind="item"
          :design="design"
          :groupItem="item"
        />
      </template>
      <!-- 当为对象时，显示tabs样式 -->
      <template v-else-if="typeof(item) == 'object' && item.widget =='tabs'">
        <field-tabs-group
          v-if="item.visible!=false"
          :key="index"
          :values="values"
          :form="form"
          :form-schema="formSchema"
          v-bind="item"
          :design="design"
          :tabsItem="item"
        />
      </template>
      <!-- 显示简单分隔符 -->
      <template v-else-if="item === '-'">
        <div class="divider vbg-2" v-if="item.visible!=false" :key="index"></div>
      </template>
      <!-- 如果以<开头的字符串，则渲染为HTML元素 -->
      <template v-else-if="typeof(item)=='string' && item.startsWith('<')">
        <div v-html="item" :key="index"></div>
      </template>
      <!-- 
        其他普通字段 
        做了修改，原来如下，稳定后可删除
        :schema="schemas[item.name]"
      -->
      <field
        v-else-if="design?true:item.visible!=false"
        :key="index"
        :values="values"
        :schema="design?schemas[item.designId]:schemas[item.name]"
        :form="form"
        :form-schema="formSchema"
        :design="design"
      ></field>
    </template>
  </draggable>
  <!-- </div> -->
</template>

<script>
import Field from "./field";
import FieldGroup from "./groups/default";
import FieldTabsGroup from "./groups/tabs";
import { getFieldSchema } from "./utils";
import { pick } from "ramda";
import Draggable from "vuedraggable";
import DragMixin from "./design/widgets/design.mixin";

export default {
  name: "RichFormLayout",
  components: { Field, FieldGroup, FieldTabsGroup, Draggable },
  mixins: [DragMixin],
  props: {
    fields: { type: Array, default: () => [] }, // 表单字段规格
    values: { type: Object, default: () => {} },
    options: { type: Object, default: () => {} }, //  布局配置
    form: { type: Object, default: () => {} },
    formSchema: { type: Object, default: () => {} },
    design: { type: Boolean, default: false }
  },
  data() {
    return {
      loading: false
    };
  },
  computed: {
    schemas() {
      const schemas = {};
      const _this = this;
      // this.fields.forEach(
      //   field => (schemas[field.name] = this.getFieldSchema(field))
      // );
      // 2019-12-10 做了修改，原来如上
      this.fields.forEach(field => {
        if (_this.design) {
          // 保证引用地址不变
          const mergeProperty = this.getFieldSchema(field);
          for (let attr in mergeProperty) {
            this.$set(field, attr, mergeProperty[attr]);
          }
          schemas[field.designId] = field;
        } else {
          schemas[field.name] = this.getFieldSchema(field);
        }
      });
      return schemas;
    }
  },
  created() {},
  mounted() {
    this.$emit("mounted");
  },
  methods: {
    getFieldSchema(item) {
      if (typeof item === "string") item = { name: item };
      try {
        return Object.assign(
          {},
          getFieldSchema(item.name, this.formSchema),
          // 提取布局配置参数用于覆盖字段的相应的属性
          pick(["labelWidth"], this.options || {}),
          item
        );
      } catch (e) {
        return {};
      }
    }
  }
};
</script>
<style lang="scss">
</style>
 