<!--

    使用模板字段渲染字段内容

    核心技术是采用art-template简约、超快的模板引擎。

    {
        widget:"template",
        template:"{{value}}"
    }

    模板支持value,field,form,values,schema,formSchema上下文插值变量,
    因此，可以使用:<template>
    template="{{value}}"     输出原始字段值
    template="{{if values.enabled }}{{value}}{{/if}}"    
    
    template字符串的语法请参考artTemplate文档




http://aui.github.io/art-template/zh-cn/docs/syntax.html






-->

<template>
	<div class='template-widget'>{{ renderTemplate() }}</div>
</template>

<script>
import WidgetMixin from "./base.mixin";
import artTemplate from "art-template/lib/template-web"
import { get } from "vuex-pathify"

export default {
    name: "TemplateWidget",
    mixins: [ WidgetMixin ],
    computed:{ 
        theme:get("my/theme")
    },
	data() {
		return {  };
    },
    methods:{
        defaultSchema(){
            return {
                template:'{{value}}',
            }
        },
        renderTemplate(){           
            return artTemplate.render(this.field.template,{
                value:this.value,
                field: this.field, // 传入字段数据
                values: this.values,
                form: this.form,
                formSchema: this.formSchema,
                theme:this.theme
            },{loader:null})
        }
    }
	
};
</script>

<style lang="scss"> 
 

</style>
