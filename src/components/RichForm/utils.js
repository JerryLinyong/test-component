import nanoid from "nanoid"
import { path,flatten,isEmpty  } from "ramda"
import Vue from "vue"
import { setObjectDefaults } from "@/utils"


//预设的按钮
const presetActions={
    submit: {
        name   : "submit",                              // 唯一名称
        type   : "primary",                             // 按键类型,默认为primary
        title  : i18n.t("richform.submit"),              // 按键的文字
        icon   : "",                                    // 按键图标
        visible: true,                                  // 按键是否可见
        tips   : i18n.t("richform.submit"),             // 鼠标悬浮在按键的提示信息
        submit : true                     
    },
    reset:{
        name   : "reset",                                 
        type   : "",                             
        title  : i18n.t("richform.reset"),               
        icon   : "",                                    
        visible: true,                                
        tips   : i18n.t("richform.reset"),    
        reset  : true       
    },
    help:{
        name   : "help",                                  
        type   : "",                             
        title  : i18n.t("richform.help"),               
        icon   : "help", 
        right  : true,                                 
        visible: true,                                 
        tips   : i18n.t("richform.help")            
    }
}

export function normalizeAction(action) {
    setObjectDefaults(action,{
        name   : "",                    // 唯一名称
        type   : "",                    // 按键类型,默认为primary
        title   : "",                   // 按键的文字
        icon   : "",                    // 按键图标
        size   : "",                    // 按钮尺寸
        right  : false,                 // 如果 = true，则显示在右侧
        top    : false,                 // 默认显示在底部，=true，是显示在表单顶部
        visible: true,                  // 按键是否可见
        tips   : "",                    // 鼠标悬浮在按键的提示信息
    })  
    // 如果没有指定tips，则使用text
    if(action.tips==undefined) actiondata.tips=actiondata.title
    return action
}
export function normalizeForm(form) {
    setObjectDefaults(form,{
        id             : nanoid(),
        schemaId       : '',                // 声明该表单所匹配的JSON Schema $id值
        name           : "",
        viewOnly       : false,             // 仅用来显示的表单，不会渲染部件，而是显示字段的友好值
        enabled        : true,              // 表单使能状态，默认true
        border         : false,              // 显示边框
        fit            : false,             // 自动充满容器
        grid           : false,             // 是否显示网格线
        readOnly       : false,             // 只读状态，不允许提交
        size           : "medium",
        inline         : false,             // 默认false,true代表字段显示在一行内
        advanced       : true,              // 是否显示高级选项，默认true
        // 作用于字段
        labelWidth     : 0,                 // 标签宽度,可选px值，仅当labelInline=false生效
        labelAlign     : "right",            // 标签对齐, 默认左对齐, 可选右对齐,居中
        labelSuffix    : true,              // 字段标题后缀内容，默认': '
        labelInline    : true,              // 标题与字段内容是否显示在同一行,false时标题显示在上方
        //
        showRequire    : true,              // 是否显示一个红色*代表字段是必须输入的
        showHelp       : false,             // 是否显示一个帮助图标，
        history        : {                  //显示表单字段输入历史配置
            enabled    : true,              //开启这项功能
            storage    : "local",           // 历史存储方式,local                  = 使用LocalStorage进行保存
            key        : ""                 //本地存储时所使用的key, field            = 使用字段名称,form     = 使用表单名称,url: 使用访问url进行hash
        },
        validator      : {                  // 验证器配置
            /**
             * 决定什么时候进行验证，取值,
             * input： 在输入时马上验证，边输入边验证             * 
             * change: 当值改变时进行验证,一般会在当失去焦点时进行验证
             * submit：当提交时进行验证,
             * */            
            on         : 'change',
        },
        submit         : {
            onlyDirty  : false,           // 仅提交脏值，即只提交修改过的值，
            url        : "",              // 提交的目标url，如果mode=='event'则无效
            feedback   : true,            // 提交时如果校验出错是否将错误信息反馈到界面上
            // 表单提交方式
            // standard : 标准的表单提交方式，可能会导致页面跳转，在单页应用时代一般很少使用
            // ajax   : 以AJAX方式提交表单
            // event  : 触发submit事件并将值传递给父组件进行处理，
            mode       : "ajax",          
            method     : "post",          // 提交时使用的HTTP 方法，默认是post
            enctype    : "",              // 当需要上传文件时，自动置为multipart/form-data
            query      : {}               // 提交时附加在url上面的查询参数
        },
        actions        : [ //数组,一个对象表示一个表单的工具栏，一般显示
            "submit",
            "reset",
            "help"
        ],
        layout         : []
    })

    // 提供默认动作按钮
    form.actions.forEach((action,index)=>{
        if(typeof(action)=="object"){
            normalizeAction(action)
        }else if(typeof(action)=="string"){
            if(action in presetActions){
                Vue.set(form.actions,index,presetActions[action])
            }
        }
    })
    return form
}

export function normalizeField(field) {
    setObjectDefaults(field,{
        name      : "",
        visible   : true,
        enabled   : true,
        readyOnly : false,                  // 只读
        showLabel : true,                   // 是否显示标题
        labelWidth: null,
        width     : null,                   // 作用于value组件的宽度，如果没有指定会自动充满
        grow      : 1                       // 参考flex-grow，用来实现同一个分组内如何分配宽度或高度
    })
    return field
}

/**
 * 在全局JSON Schema获取指定字段成员的JSON Schema
 * 
 * 例：
 *    getFieldScheam("network.ip",formSchema)
 * 
 * @param name   字段名称，如果是对象内部，则使用.分开，如network.ip
 * @parentSchema
 */

export function getFieldSchema(name,pSchema){
    if(name==undefined || typeof(name)!='string' || name.trim()==''){
        throw new Error(i18n.t('richform.invalidFieldName').params(name))
    }
    // 
    if(pSchema.type=='object' || pSchema.type=='array' ){
        let fnames = name.split(".")
        if(pSchema.type=='array'){
          fnames.shift()
        }
        let resultSchema
        //字段的schema可能存在于properties,then.properties,else.properties
        for(let schema of [
                pSchema,
                pSchema.then && pSchema.then.properties ? pSchema.then : null,
                pSchema.else && pSchema.else.properties ? pSchema.else : null,
                pSchema.items && pSchema.items.properties ? pSchema.items : null,
            ]){
                if(schema){
                    let fieldSchema=""
                    if(schema.properties && fnames[0] in schema.properties){
                        fieldSchema= Object.assign({},schema.properties[fnames[0]])
                    }else if(schema.patternProperties && '.+' in schema.patternProperties && schema.patternProperties['.+'].properties){
                      if(fnames.length>1){
                        fnames = fnames.slice(1)
                      }
                      fieldSchema= Object.assign({},schema.patternProperties['.+'].properties[fnames[0]]||schema.patternProperties['.+'].properties)
                    }
                    if(fieldSchema){
                        if(fnames.length==1){
                            resultSchema = fieldSchema
                        }else{
                            resultSchema = getFieldSchema(fnames.slice(1).join("."),fieldSchema)
                        }
                        if(resultSchema) break
                    }                 
                }
        } 
        if(resultSchema){
            resultSchema.name = name
            return resultSchema
        }else{
          logger.warn(i18n.t('richform.invalidFieldName').params(name))
          // throw new Error(i18n.t('richform.invalidFieldName').params(name))
        }    
    }else{
        throw new Error(i18n.t('richform.invalidFieldName').params(name))
    }
}

function pickFieldGroupSchemas(fields,schema,options={}){
    let schemas={}
    fields.forEach((item)=>{
        if(Array.isArray(item)){
            schemas={...schemas,...pickFieldGroupSchemas(item,schema,options)}
        }else if(typeof(item)=='object'){
            if(item.widget==='group'){
                Object.assign(schemas,pickFieldGroupSchemas(item.fields,schema,options))
            }else if(item.widget==='tabs'){
                item.tabs.forEach((tab)=>{
                    Object.assign(schemas,pickFieldGroupSchemas(tab.fields,schema,options))
                })
            }else{
                try{
                    schemas[item.name]=getFieldSchema(item.name,schema,options)
                }catch(e){
                    logger.warn(i18n.t('richform.noschema').params(item.name))
                }                
            }
        }else if(typeof(item)=="string" && item!=="-" && !item.startsWith("<")){
            try{
                schemas[item]=getFieldSchema(item,schema)
            }catch(e){
                logger.warn(i18n.t('richform.noschema').params(item.name))
            }   
        }
    })
    return schemas
}

/**
 * 根据表单定义数据，从Schema中提取出所有的字段的Schema
 * 
 * 如果
 * form.layout=[
 *  "network",
 *  "network.ip",
 *  "dns"
 * ]
 * ==
 *  {
 *    "network":{..schema..},
 *    "network.ip":{..schema..},
 *     "dns":{..schema..}
 *  }
 *  
 * 
 * @param {*} items   布局成员数组 
 * @param {*} schema 
 */
export function pickFormSchemas(form,schema){
    return pickFieldGroupSchemas(form.layout || [] , schema )
}


/**
 * 根据类似network.ip这样的名称，从values={network:{ip:<value>}}
 */
export function getFieldValue(name,values){
    try{
        return path(name.split("."),values)
    }catch(e){
        logger.warn(i18n.t("richform.getValueErr").params(name,e.message))
        return ""
    }
}

/**
 * 
 *   values={x:1,y:{y1:1}}
 *  initFieldObjectByPath("a",values)==> {a:{}}
 *  initFieldObjectByPath("a.b",values)==> {a:{b:{}}}
 *  initFieldObjectByPath("x",values)==> {x:1}  //已经存在
 *  initFieldObjectByPath("y.y2",values)==> {x:1,y:{y1:1,y2:{}}}  //已经存在
 * 
 * 
 * @param {*} name 
 * @param {*} value 
 */
// 根据默认的schema生成相应的value数据，可深嵌套
export function initFieldObjectByPath(names,values,native=false,fieldSchema){
    let pvalues=values
    let schema = fieldSchema
    for(let i=0;i<names.length;i++){
        if(!(names[i] in pvalues)){
            if(native){
                if(schema.type.toLowerCase()==='array'){
                  pvalues[names[i]]=[]
                  schema = schema.items
                }else{
                  pvalues[names[i]]={}
                  if(i+1<names.length){
                    schema=getFieldSchema(names[i+1],schema)
                  }
                }
            }else{
                if(schema.type&&schema.type.toLowerCase()==='array'){
                  Vue.set(pvalues,names[i],[]) 
                  schema = schema.items
                }else {
                  Vue.set(pvalues,names[i],{}) 
                  if(i+1<names.length){
                    schema=getFieldSchema(names[i+1],schema)
                  }
                }
          }  
        }
        pvalues=pvalues[names[i]]        
    }
}
/**
 * 
 * @param {*} name 
 * @param {*} value 
 * @param {*} values 
 * @param {*} native  如果=true则数据不会使用Vue.set，则不是会是响应式的
 */
export function setFieldValue(name,value,values,native=false,schema={}){
    try{
        let names=name.split(".")
       
        if(names.length==1){
            Vue.set(values,names[0],value)
        }else{//>1说明是一个Object,a.b代表a={},a.b.c代表a,b={}，也可能是数组，看schema定义
            const fieldSchema = getFieldSchema(names[0],schema)
            initFieldObjectByPath(names.slice(0,-1),values,native,fieldSchema)
            if(native){
                path(names.slice(0,-1),values)[names[names.length-1]]=value
            }else{
              Vue.set(path(names.slice(0,-1),values),names[names.length-1],value)
            }            
        } 
    }catch(e){
        logger.warn(i18n.t("richform.setValueErr").params(name,e.message))
    }
}

/**
 *  判断指定字段名称是否在values里面存在
 * 
 *  values={
 *     sn:"123456",
 *     location:{
 *          x:1
 *     }
 *  }
 *  
 * 
 * @param {*} fieldname 
 * @param {*} values 
 */
export function fieldValueIsExists(fieldname,values){
    if(fieldname in values){
        return true
    }else if(fieldname.includes(".")){
        return path(fieldname.split("."),values)!==undefined
    }else{
        return false
    }    
}

/**
 * 根据values生成自动布局
 * values={
 *      a:1,
 *      b:{
 *          b1:1,b2:2,
 *          b3:{x:1}
 *      }
 * }
 * 自动生成布局:
 *   Layout=[
 *      "a",
 *      "b.b1",
 *      "b.b2",
 *      "b.b3.x"
 *   ]
 *   如果提供schema，则同时会在schema中查找对应的schema,
 * 
 * @param {*} values 
 */
export function valuesToAutoForm(values,schema){
    let form=normalizeForm({})
    function flatDictNames(vs,parentName){
        let names =Object.keys(vs).map((name)=>{
            let value=vs[name],xname=parentName ? `${parentName}.${name}` : name
            if(!Array.isArray(value) && typeof(value)=='object' && !isEmpty(value)){
                return flatDictNames(value,xname)                
            }else{
                return xname
            }
        })
        return flatten(names)
    }    
    if(schema && typeof(schema)=='object' && !isEmpty(schema)){
        form.layout=flatDictNames(values).map((name)=>({name:name,...getFieldSchema(name,schema)}))
    }else{
        form.layout=flatDictNames(values)
    }
    return form
}
/**
 * 根据Schema自动生成表单
 * 生成规则与valuesToAutoForm类似
 * @param {*} schema 
 */
export function schemaToAutoForm(schema){
    let form=normalizeForm({})
    function flatDictNames(vs={},parentName){
        let names =Object.keys(vs).map((name)=>{
            let value=vs[name],xname=parentName ? `${parentName}.${name}` : name
            if(!Array.isArray(value) && typeof(value)=='object' && !isEmpty(value) && value.type=='object'){
                return flatDictNames(value.properties,xname)                
            }else{
                return xname
            }
        })
        return flatten(names)
    }    
    if(schema && typeof(schema)=='object' && !isEmpty(schema) && schema.type=='object'){
        //form.layout=flatDictNames(schema.properties).map((name)=>({name:name,...getFieldSchema(name,schema)}))
        form.layout=flatDictNames(schema.properties).map((name)=>{
            return {name:name,...getFieldSchema(name,schema)}
        })
    }
    return form
}

