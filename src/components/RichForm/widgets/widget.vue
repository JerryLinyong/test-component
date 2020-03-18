<!--

   使用方法

   <field name="<fieldname>"  widget="input" :meta="<fieldSchema>"></fieldname>

    meta: 
    在表单布局中的定义，例:
        {
            name:"必须，字段名称", 
            widget:"可选，如果没有指定，则使用schema里面声明的widget",
            ....
        }
    </template>
    
    <script>
    export default {
    
    }
    </script>
    
    <style>
    
    </style>
    

-->
<template>
    <keep-alive>
        <component 
            :is="asyncFieldComponent" 
            :values="values"
            :schema="schema"
            :form="form"
            :form-schema="formSchema"
            :initial="initial"            
            v-bind="$attrs"
            v-on="$listeners"
            @change="onChange"/>
    </keep-alive>	
</template>
<script>

export default {
    inject: ["errors"],
	props: {
        name      : { type: String,required: true}, 
        values    : { type: Object, default: () => {}},
        schema    : Object,                                          // 传入字段数据
        form      : { type: Object, default: () => {}},
        formSchema: { type: Object, default: () => {}},
        initial   : {type : Object,default : () => {value: null}},   // 初始值 
        keepAlive : { type: Boolean,default: true},                  // 是否保持缓存		
        delay     : { type: Number,default : 20},                    // 延迟加载时间		
        timeout   : { type: Number,default : 2000}                   // 超时警告时间
    }, 
	data() {
        return {            
			asyncFieldComponent: resolve => ({
				component: import(`./${this.name}`),
				loading: {
					template:
						'<div style="height: 100%; width: 100%; display: table;"><div style="display: table-cell; vertical-align: middle; text-align: center;"><div>加载中</div></div></div>'
				},
				error: {
					template:
						'<div style="height: 100%; width: 100%; display: table;"><div style="display: table-cell; vertical-align: middle; text-align: center;"><div>加载错误</div></div></div>'
				},
				delay: this.delay,
				timeout: this.timeout
			})
		};
    },
    methods:{
        onValidate(errors){
            this.$emit("validate",errors)
        },
        onChange(value){
            this.$emit("change",this.schema.index,value)
        }
    }
    
};
</script>