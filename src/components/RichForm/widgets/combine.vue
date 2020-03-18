<!--  
    组合字段

    用于数组类型，允许数据的每个成员均使用一个widget进行渲染


    例如:
    dns:["192.168.1.2","12.12.12.2"]
        dns: {
                type:"array",
                title:"域名服务器",
                widget:"combine",
                description:"DNS域名服务器地址",
                showHelp:true,
                vertical:false,//默认水平排序，允许垂直排列
                separator:"-",// 项目之间添加一个分割符
                items: {
                    type: "string",
                    format:"ipv4",
                    widget:"textbox"
                },
                maxItems: 2,
                uniqueItems: true
            }
        },


-->
<template>
	<div 
        :class="[
            'combine-widget',
            {
                inline:'schema.inline!=false'
            }
        ]"    
    >
        <template v-for="(item,index) of value">
            <widget :key="index" 
                :name="schema.items.widget || 'textbox'"
                :schema="{index:index,...schema.items}"        
                :form="form"
                :form-schema="formSchema"          
                :initial="{value:item}"
                @validate="onValidate" 
                @change="onChange"               
            ></widget>
        </template>
	</div>
</template>

<script>
import WidgetMixin from "./base.mixin";
import Widget from "./widget"
export default {
	name: "CombineWidget",
    components: { Widget },
    mixins: [ WidgetMixin ],
    watch:{
    },
	created() {},
	mounted() {},
	methods: {
		onValidate(){

        },
        onChange(index,value){
            this.$set(this.value,index,value)
            this.$emit("change",this.value)
        }
	}
};
</script>

<style lang="scss">

.richform{
    .layout{
        .combine-widget{
            display: flex;
            flex-direction: column;
            &>*{
                padding-top:2px;
                padding-bottom:2px;
            }
            &.inline{
                flex-direction: row;
                padding-right:2px;
                &>*{
                    padding-right:2px;
                }
            }
            
        }
    }

}

</style>
 