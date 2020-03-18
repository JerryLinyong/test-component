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
            @fieldchange="字段改变事件"    
        ></rich-form>

    2. 表单数据 JSON Schema描述
      采用JSON Schema描述表单各个字段的规格

    3. 描述表单结构

    form={
        id:"自动生成的唯一",
        name             : ""              // 表单英文名称
        url              : ""              // 提交的url
        submit           : "ajax",         // 表单提交方式,default:以默认向url地址提交;ajax:以AJAX方式提交表单
        enabled          : true,           // 表单使能状态，默认true
        eiditable        ：false,          // 表单是否可以编辑，默认为false
        border           : true,           // 显示边框
        size             : "",             // 表单的尺寸，取值large,medium,small，默认为medium
        fit              : false,          // 自动充满容器
        grid             : false,          // 显示网格线
        readOnly         : false,          // 只读状态，不允许提交
        shcemaEntry    : "",               // 指定schema入口，根据JSON路径来指定即可，如{...properties:{a:{}}},a
        inline           : false,          // 表单布局方法，inline=true代表字段排列采取水平布局方式
        advanced         : true,           // 是否显示高级选项，默认=true
        labelWidth       : "auto",         // 标签宽度,可选px值
        labelAlign       : "left"          // 标签对齐, 默认左对齐, 可选右对齐
        labelSuffix      : true            // 字段标题后缀内容，默认' : '
        labelInline      : true,           // 标题与字段内容是否显示在同一行,false时标题显示在上方
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
            flat:false,//对JSON默认按Schema结构进行验证，如果=true则忽略层次结构分别对每个字段进行验证
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
            },
            //针对三个常见的按钮，可以只提供名称即可
            "submit",
            "clear",
            "reset"
        ]
        layout:[
            "字段名称",
            // 每个字段使用一个{}描述
            {
                widget:"",               // 可选的，字段的渲染默认由schema里面的widget值决定，如果此处提供则使用
                name:"字段名称",          // 字段名称，必须在schema里面具有对应的定义，否则不能校验
                flexGrow: 1,             // 占据行多余的空间的比例，默认为均为1
                advanced: true,          // 是否是高级选项,默认false
                showHelp: true,          // 是否显示一个图标,默认false，=true时会显示schema中的help
                showLabel: true,         // 是否显示标签,默认true
                inline:'auto'            // 是否标签与内容显示在同一行,默认inline=true
                width:'',                // 额外的最小宽度,默认为 300px
                style:{}                 // 额外的样式，被作用于字段
                labelStyle:{},
                valueStyle:{},
                enabled:{
                  type:{ // type 为依赖的字段名称
                    minLength:1 // 最小长度为1时，可以输入
                  }
                }
            }
            // 相当于{widget:'group',fields:[]}的简写形式，并且不显示分组标题
            [
                {....},
                {....}
            ], 
            // 显示一个带标题且可折叠的分组
            {
                widget:"group",
                name:"",                       // 组名称 
                inline:true,                   //  组内字段显示在一行内      
                wrap:false,                    // 当一行无法容纳所有field时，是否自动换行，inline=true时生效
                labelWidth:"",                 // 可以单独为该分组指定labelWidth来覆盖全局labelWidth
                title:"",
                fields:[                       // 定义该分页内需要显示的字段，将采用一个FormLayout进行渲染
                    {...},{...}
                ],
                actions:[]                     //  分组可以在下方显示一个工具条
            },
            { 
                widget:"tabs",
                actions:[],                 // 用来显示tabs底部按钮
                inline:false,               // 默认采用从上到下的布局方法，如果此值=true，则采用水平布局
                tabs:[                      // 每一个tab包含的内容
                    {                    
                        label: "",          // tab名称
                        name: "",           // tab的key
                        icon:""             // 图标
                        fields: [],         // 定义该页签的字段布局，将采用一个FormLayout进行渲染
                    },
                    ....                  
                ]
            }
            // 显示为一条水平分割线
            "-",                   
            // 以<开头的内容则视为HTML，直接渲染到表单中        
            "<"                            
        ]
    }

    4. 事件
    - 字段改变事件  fieldchange(fieldname,value,friendValue)   
    - 表单提交事件  当submit.mode='event'时，调用提交按钮会触发data(values)事件 
    - 动作按钮事件  当按下定义的按钮时触发 action(action)事件
    - 提交事件      当向远程服务器提交表单后触发 submit(error)事件，如果成功则error=undefined
    - 

-->

<template>
  <div
    tag="form"
    :name="formData.name || formData.id"
    :id="formData.id"
    :class="[
            'richform',
            [formData.size],
            {          
                readonly                      : formData.readOnly,
                disabled                      : !formData.enabled,
                inline                        : formData.inline,
                grid                          : formData.grid,
                'vborder-1'                   : formData.border,
                fit                           : formData.fit,
                'no-label-suffix'             : !formData.labelSuffix,
                'inline-label'                : formData.labelInline,
                'hide-advanced'               : !formData.advanced,
                [formData.labelAlign+'-label']: formData.labelAlign != 'right',
                empty                         : !formIsReady,
                'active-design-item':design&&form.isClicked
            },
            
        ]"
    :method="formData.method"
    :enctype="_hasFileUpload ? 'multipart/form-data' : ''"
    :action="formData.url"
    v-loading="loading||uploading"
    :element-loading-text="loadingText"
    @submit="onSubmit($event)"
  >
    <PerfectScrollbar :style="formStyle">
      <fieldset :disabled="formData.readOnly">
        <!-- 顶部工具按钮 -->
        <form-actions v-if="topActions.length>0" :actions="topActions" :form="formData"></form-actions>
        <!-- 根布局 -->
        <form-layout
          :values="valuesData"
          :form="formData"
          :form-schema="schemaData"
          :fields="formData.layout"
          :design="design"
        ></form-layout>
        <!-- 底部工具按钮 -->
        <form-actions
          v-if="bottomActions.length>0&&showActions"
          :actions="bottomActions"
          :form="formData"
        ></form-actions>
        <!-- 表单占位 -->
        <div v-show="design" class="rich-form-design" @click="onClickedItem(form)"></div>
      </fieldset>
    </PerfectScrollbar>
    <!-- 如果表单没有在加载中，并且表单没有 -->
    <div class="no-ready" v-if="!loading && !formIsReady">
      <div class="message" v-if="!design">表单未初始化</div>
      <div class="message" v-else>请拖动左侧组件</div>
      <el-button type="text" @click="onRetryLoad" v-show="!design">{{$t("richform.retry")}}</el-button>
    </div>
    <!-- 在加载表单或者提交时出错显示 -->
    <div class="error" v-if="formError">
      <div>
        <i class="el-icon-warning-outline icon"></i>
        <div class="message">{{ formError }}</div>
        <el-button type="text" @click="onRetryLoad">{{$t("richform.retry")}}</el-button>
        <el-button type="text" @click="onCancelLoad">{{$t("richform.cancel")}}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { PerfectScrollbar } from "vue2-perfect-scrollbar";
import http from "@/utils/http";
import eventbus from "./eventbus";
import { dissoc, path, uniq, isNil, isEmpty, mergeAll } from "ramda";
import FormLayout from "./layout";
import FormActions from "./actions";
import ajv, { localize as localizeErrors } from "./validator";
import { uploadImgUrl } from "./urls";
import { getToken } from "@/utils/auth";
import DragMixin from "./design/widgets/design.mixin";
import {
  normalizeForm,
  setFieldValue,
  pickFormSchemas,
  fieldValueIsExists,
  getFieldValue,
  getFieldSchema,
  valuesToAutoForm,
  schemaToAutoForm
} from "./utils";
import axios from "axios";

export default {
  name: "RichForm",
  components: { FormLayout, FormActions, PerfectScrollbar },
  mixins: [DragMixin],
  props: {
    defaultForm: Object, // 用来添加自动生成的form表单字段
    isNeedValidForm: { type: Boolean, default: true }, // 是否要验证表单的字段
    schema: { type: Object, default: () => ({}) }, // 表单字段规格
    form: { type: Object, default: () => ({}) }, // 表单定义数据
    values: { type: Object, default: () => ({}) }, // 表单初始值
    formStyle: { type: Object, default: () => ({}) }, // 表单的样式
    // 以下三个url是可选的,如果提供schema，form,values值为空且提供以下url，则自动从远程进行加载
    schemaUrl: String,
    formUrl: String,
    valuesUrl: String,
    // 当没有提供form定义时，是否根据schema和value和自动生成表单
    // 默认根据values自动生成,如果没有提供values，则根据schema自动生成
    isGenerateDefaultValues: { type: Boolean, default: false }, // 是否自动生成默认value
    autoForm: { type: Boolean, default: false },
    showActions: { type: Boolean, default: false },
    design: { type: Boolean, default: false }
  },
  data() {
    return {
      token: "Bearer " + getToken(),
      formId: parseInt(Math.random(0, 10) * 10000),
      uploading: false, // 正在上传
      preparing: false, //表单准备中，即正在加载数据
      //-----渲染表单所需要的数据----
      usePropValues: this.valuesUrl ? false : true, // 是否使用从props加载的values
      //---远程加载的数据------
      remoteSchema: {},
      remoteForm: {},
      remoteValues: {},
      //------正在从远程加载数据-------
      schemaLoading: false,
      formLoading: false,
      valuesLoading: false,
      //--------
      errors: {},
      depends: {}, // 保存字段依赖关系
      hideFields: [], // 隐藏字段名称列表
      disabledFields: [], // 禁用字段名称列表
      dirtyFields: [], // 修改过的字段
      _validator: null, // 校验器
      // ---
      loadingText: "", // 设置加载文本
      formError: null, // 加载出错时显示的文本
      // ----------提交
      submiting: false, // 正在提交中
      submitParams: {
        onlyDirty: false, // 仅提交脏值，即只提交修改过的值，
        url: "", // 提交的目标url，如果mode=='event'则无效
        feedback: true, // 提交时如果校验出错是否将错误信息反馈到界面上
        // 表单提交方式
        // standard : 标准的表单提交方式，可能会导致页面跳转，在单页应用时代一般很少使用
        // ajax   : 以AJAX方式提交表单
        // event  : 触发submit事件并将值传递给父组件进行处理，
        mode: "ajax",
        method: "post", // 提交时使用的HTTP 方法，默认是post
        enctype: "", // 当需要上传文件时，自动置为multipart/form-data
        query: {} // 提交时附加在url上面的查询参数
      },
      retryFor: "" // 当显示重试界面时，点击重试的行为submit=提交，load=重新刷新加载
    };
  },
  computed: {
    loading: function() {
      return (
        this.preparing ||
        this.schemaLoading ||
        this.formLoading ||
        this.valuesLoading
      );
    },
    topActions: function() {
      return this.formData.actions.filter(action => action.top == true);
    },
    bottomActions: function() {
      return this.formData.actions.filter(action => action.top != true);
    },
    /**
     * 表单数据是否准备就绪
     */
    formIsReady: function() {
      return (
        !isEmpty(this.formData) &&
        Array.isArray(this.formData.layout) &&
        this.formData.layout.length > 0
      );
    },
    /**
     * Schema数据是否准备就绪
     */
    schemaIsReady: function() {
      return !isEmpty(this.schemaData);
      this.schemaData.type == "object" &&
        this.schemaData.properties &&
        !isEmpty(this.schemaData.properties);
    },
    /**
     * 获取表单所使用的Schema
     */
    schemaData: function() {
      return this.schemaUrl ? this.remoteSchema : this.schema;
    },
    localForm: function() {
      return normalizeForm(this.form);
    },
    formData: function() {
      // 如果提供formUrl,则使用远程加载的表单数据，否则使用本地表单数据
      let formData =
        this.formUrl || this.autoForm
          ? normalizeForm(this.remoteForm)
          : this.localForm;
      if (this.defaultForm) {
        return Object.assign(formData, this.defaultForm);
      }
      formData.id = this.formId;
      return formData;
    },
    valuesData: function() {
      return this.usePropValues ? this.values : this.remoteValues;
    },
    /**
     * 返回表单是否合法有效
     *
     * 判定依据如下：
     *
     * 1.当Schema指定$id值，并且form也指定schemaId时
     * 如果schema.$id!=form.schemaId，则说明该表单与Schema不匹配
     * 此时，会在控制台显示一个"表单不匹配"的信息供开发人员调试时使用
     * 同时组件提示：“正在准备...”
     *
     * 之所以这样，是因为from和schema的值的加载可能不会同步
     *
     * 2. 如果Schema没有$id值，或者form也没有指定schemaId时，
     * 两者可能匹配也可能不匹配,因此在表单提示警告，但是返回true
     * 此种情况下，可能因为schame与form不匹配而产生渲染上的不正常
     *
     */
    isValidForm: function() {
      if (this.schemaData.$id && this.formData.schemaId) {
        if (this.schemaData.$id == this.formData.schemaId) {
          return true;
        } else {
          logger.warn(
            this.$t("richform.nomatch").params(
              this.schemaData.$id,
              this.formData.schemaId
            )
          );
          return false;
        }
      } else {
        logger.warn(this.$t("richform.schemaid"));
        return true;
      }
    },
    /**
     * 表单准备就绪应满足：
     * 1. 必须提供schema
     * 2. 必须提供form数据
     *    如果没有提供并且指定autoForm时，会根据schema或values自动生成简单的form
     *
     * 注意：
     *   values并不是必须的，
     *   如果没有提供values，则会根据schema和form自动生成
     *
     */
    ready: function() {
      return (
        this.schemaIsReady &&
        this.formIsReady &&
        this.isValidForm &&
        !this.preparing
      );
    }
  },
  /**
   * 为所有后代组件提供数据
   */
  provide() {
    return {
      errors: this.errors,
      hideFields: this.hideFields,
      disabledFields: this.disabledFields,
      dirtyFields: this.dirtyFields,
      slots: this.$slots
    };
  },
  watch: {
    schemaUrl: async function(newValue) {
      await this.load();
    },
    formUrl: async function(newValue, oldValue) {
      await this.load();
    },
    valuesUrl: async function(newValue, oldValue) {
      await this.load();
    },
    autoForm: async function(newValue, oldValue) {
      await this.load();
    },
    async schema() {
      if (this.autoForm) {
        await this.generateAutoForm();
      }
    },
    async values() {
      // 关闭错误的提示
      await this.$nextTick();
      this.clearErrors();
      this.dirtyFields = [];
      this._updateDepends();
    }
  },
  async created() {
    await this.load(); // 加载表单
  },
  destroyed() {
    this._unregisterEvents();
  },
  mounted() {
    // this.$nextTick(()=>{
    //     this._updateDepends()
    // })
  },
  methods: {
    scrollTo(selector) {
      $(this.$el)
        .find(selector)
        .get(0)
        .scrollIntoView(true);
    },
    // 上传友好值
    emitFriendValue() {
      eventbus.$emit("emitFriendValue");
    },
    /**
     * 当没有提供form时，自动根据schema和values自动生成表单
     */
    generateAutoForm() {
      let form = {};
      try {
        form = schemaToAutoForm(this.schemaData);
      } catch (e) {
        logger.debug(this.$t("richform.genFormErr").params(e.message));
      }
      if (typeof form == "object" && (!form.layout || isEmpty(form.layout))) {
        try {
          form = valuesToAutoForm(this.valuesData, this.schemaData);
        } catch (e) {
          logger.debug(this.$t("richform.genFormErr").params(e.message));
        }
      }
      this.remoteForm = form;
      return form;
    },
    _registerEvents() {
      this._unregisterEvents();
      // 订阅相关事件
      if (this.isNeedValidForm) {
        eventbus.$on(`${this.formData.id}:field:valid`, this.onFieldValueValid);
        eventbus.$on(`${this.formData.id}:field:error`, this.onFieldValueError);
      }
      eventbus.$on(`${this.formData.id}:field:change`, this.onFieldValueChange);
      eventbus.$on(`${this.formData.id}:action`, this.onAction);
    },
    _unregisterEvents() {
      eventbus.$off(`${this.formData.id}:field:change`);
      eventbus.$off(`${this.formData.id}:field:valid`);
      eventbus.$off(`${this.formData.id}:field:error`);
      eventbus.$off(`${this.formData.id}:action`);
    },
    async onCancelLoad() {
      this.formError = null;
    },
    async onRetryLoad() {
      if (this.retryFor == "submit") {
        await this._submitToRemote();
      } else {
        await this.load();
      }
    },
    /**刷新依赖关系 */
    _updateDepends() {
      this._collectDepends();
      Object.keys(this.depends).forEach(fieldname => {
        this._handleFieldDepends(
          fieldname,
          getFieldValue(fieldname, this.valuesData)
        );
      });
    },
    onSubmit(event) {
      //不管任何形式提交前均需要进行校验，除非显示指定validator.on="none"即不校验
      if ((validator.on = "none")) {
      }
      // AJAX提交方式
      if (this.formData.submit == "ajax") {
        event.preventDefault();
        return false;
      } else {
        // 默认表单提交方式
      }
    },
    onAction(action) {
      this.$emit("action", action);
    },
    onFieldValueValid(fieldname) {
      if (fieldname in this.errors) this.$delete(this.errors, fieldname);
      this._validateRelateFields(fieldname);
    },
    onFieldValueError(fieldname, errors) {
      this.$set(
        this.errors,
        fieldname,
        this._formatFieldErrors(fieldname, errors)
      );
      this._validateRelateFields(fieldname);
    },
    onFieldValueChange(fieldname, value, friendValue, extraData) {
      this._handleFieldDepends(fieldname, value);
      if (!this.dirtyFields.includes(fieldname))
        this.dirtyFields.push(fieldname);
      this.$emit("fieldchange", fieldname, value, friendValue, extraData);
    },
    /**
     * 验证关联字段
     *
     * 什么是关联字段
     *
     * 主要指与字段存在父子关系或者数组成员或者依赖等等关系
     *
     *
     */
    _validateRelateFields(fieldname) {
      let names = fieldname.split("."); //names=["a","b","c"]
      let formFields = this.getFormFeilds();
      if (names.length > 1) {
        for (let i = names.length - 1; i > 0; i--) {
          let pname = names.slice(0, i).join(".");
          if (formFields.includes(pname)) {
            try {
              this.validateField(pname);
            } catch (e) {}
          }
        }
      }
    },
    /**
     * 收集字段依赖关系
     * 主要收集字段的visible和enabled两个字段的依赖，用来控制字段的可视与使能状态.
     *
     * 即如果字段的某个属性是依赖于其他字段的，则其值应该等于：
     * {<其他字段名称>:{对其他字段值进行验证的的JSON Schema}}
     * 比如:当dhcp=true时，ip,gateway,subnetmask三个字段的enabled=false
     * 即ip,gateway,subnetmask三个字段的enabled依赖dhcp的值，因此
     * ip,gateway,subnetmask三个字段的enabled应该设置为
     * {
     *    enabled:{"network.dhcp":{const:true}}
     * }
     * 又比如：A字段仅仅当B字段长度是3时才显示，则
     * A.visible={"b":{minLength: 3,maxLength: 3}}
     *
     */

    _collectDepends(fields) {
      let self = this;
      if (fields == undefined) fields = this.formData.layout || [];
      // 计算字段的依赖
      function collectFieldDepends(field) {
        if (field.name == undefined) return;
        // 收集所有可视或者依赖字段，即字段的可视依赖于某个字段的值
        ["visible", "enabled"].forEach(attr => {
          if (typeof field[attr] == "object") {
            // field[attr]=field.visible || field.enabled = {<被依赖的字段名称>:{JSON Schema} }
            Object.keys(field[attr]).forEach(dependedFieldName => {
              if (!(dependedFieldName in self.depends)) {
                self.$set(self.depends, dependedFieldName, []);
              }
              // 例：this.depends["dhcp"]=[...,
              // {name:"ip",visible:{...JSON Schema...},enabled:{...JSON Schema...}},...]
              let hasIndex = self.depends[dependedFieldName].findIndex(
                item => item.name == field.name
              );
              if (hasIndex == -1) {
                self.depends[dependedFieldName].push({
                  name: field.name,
                  [attr]: field[attr][dependedFieldName]
                });
              } else {
                self.depends[dependedFieldName][hasIndex][attr] =
                  field[attr][dependedFieldName];
              }
            });
          }
        });
      }
      fields.forEach(item => {
        if (Array.isArray(item)) {
          this._collectDepends(item);
        } else if (typeof item == "object") {
          if (Array.isArray(item.fields) && item.fields.length > 0) {
            this._collectDepends(item.fields);
          } else if (Array.isArray(item.tabs) && item.tabs.length > 0) {
            this._collectDepends(item.tabs);
          } else {
            collectFieldDepends(item);
          }
        }
      });
    },
    /**
     * 处理字段的可视化，当字段可视化发生变化时，、
     * fieldname指被依赖的字段
     */
    _handleFieldDepends(fieldname, value) {
      if (fieldname in this.depends) {
        this.depends[fieldname].forEach(field => {
          try {
            // 处理可视化
            if (field.visible !== undefined) {
              let valid = ajv.validate(field.visible, value);
              if (valid) {
                //从hideFields中删掉
                this.hideFields.splice(this.hideFields.indexOf(field.name), 1);
              } else {
                if (!this.hideFields.includes(field.name))
                  this.hideFields.push(field.name);
              }
            }
            // 处理enabled/disabled
            if (field.enabled !== undefined) {
              let valid = ajv.validate(field.enabled, value);
              // 如果value不存在,则默认不符合（bug：value为不存在则默认valid为true）
              if (value === undefined || value === null) {
                valid = false;
              }
              // 当字段无效时添加disabled类
              if (valid === true) {
                this.disabledFields.splice(
                  this.disabledFields.indexOf(field.name),
                  1
                );
              } else {
                if (!this.disabledFields.includes(field.name))
                  this.disabledFields.push(field.name);
              }
            }
          } catch (e) {
            logger.warn(this.$t("richform.dependerr").params(e.message));
          }
        });
      }
      logger.debug(
        "disabledFields=",
        this.disabledFields,
        "hideFields=",
        this.hideFields
      );
    },
    /**
     * 如果表单中包括文件上传字段，则enctype值应置为 multipart/form-data
     */
    _hasFileUpload() {
      return $(this.$el).find("input[type=file]").length > 0;
    },

    /**
     * 重新渲染表单
     */
    async refresh() {
      await this.load();
    },
    /**
     * 重新加载表单
     */
    async load() {
      this.preparing = true;
      this.loadingText = this.$t("richform.loading");
      // 同时加载Schema和Form数据
      try {
        let results = await Promise.all([
          this.loadSchema(),
          this.loadForm(),
          this.loadValues()
        ]);
        this._updateDepends(); // 收集表单依赖，以便支持字段之间联动控制visible和enabled
        this._registerEvents();
        await this.$nextTick();
        this._generateDefaultValues();
        this.preparing = false;
      } catch (e) {
        this.formError = e.message;
        this.retryFor = "load";
        this.preparing = false;
      }
    },
    /**
     * 从远程加载Schema数据，仅仅当props.schema为空时有效
     */
    async loadSchema(url) {
      // 提供有效的schemaUrl，则尝试从远程加载
      if (this.schemaUrl && this.schemaUrl != "") {
        try {
          this.schemaLoading = true;
          let { status, payload: schemaData, message } = await http.get(
            this.schemaUrl
          );
          if (status == "success") {
            this.remoteSchema = schemaData;
            if (this.autoForm) {
              this.generateAutoForm();
            }
          } else {
            throw new Error(
              this.$("richform.loadSchemaErr").params(message || status)
            );
          }
          this.schemaLoading = false;
        } catch (e) {
          this.schemaLoading = false;
          logger.warn(this.$t("richform.loadError").params(e.message));
          throw e;
        }
      }
      return true;
    },
    /**
     * 从远程加载表单,仅仅当props.form为空时有效
     */
    async loadForm() {
      // 如果props.form为空，并且提供有效的formUrl，则尝试从远程加载
      if (this.formUrl && this.formUrl != "") {
        try {
          this.formLoading = true;
          let { status, payload: formData, message } = await http.get(
            this.formUrl
          );
          if (status == "success") {
            this.remoteForm = normalizeForm(formData);
          } else {
            throw new Error(
              this.$("richform.loadSchemaErr").params(message || status)
            );
          }
          this.formLoading = false;
        } catch (e) {
          this.formLoading = false;
          logger.warn(this.$t("richform.loadError").params(e.message));
          throw e;
        }
      }
      // 当表单加载后需要清除依赖
      this._clearDepends();
      // 如果表单不存在，并且auto-form=true,则尝试自动生成表单布局。
      // 注意：自动生成的表单只支持从上至下的的简单布局(可能比较不好看)
      if (
        this.autoForm &&
        (isEmpty(this.formData) || this.formData.layout.length == 0)
      )
        this.generateAutoForm();
      return true;
    },
    /**
     * 从远程加载values数据，仅仅当props.values为空时有效
     */
    async loadValues() {
      // 如果props.schema为空，并且提供有效的schemaUrl，则尝试从远程加载
      if (this.valuesUrl && this.valuesUrl != "" && !this.usePropValues) {
        try {
          this.valuesLoading = true;
          let { status, payload: values, message } = await http.get(
            this.valuesUrl,
            { external: true }
          );
          if (status == "success") {
            this.remoteValues = values;
            if (this.autoForm) {
              this.generateAutoForm();
            }
          } else {
            throw new Error(
              this.$("richform.loadSchemaErr").params(message || status)
            );
          }
          this.valuesLoading = false;
        } catch (e) {
          this.valuesLoading = false;
          logger.warn(this.$t("richform.loadError").params(e.message));
          throw e;
        }
      }
      return true;
    },
    _clearDepends() {
      //清空依赖关系
      Object.keys(this.depends).forEach(key => this.$delete(this.depends, key));
      this.hideFields.splice(0, this.hideFields.length);
      this.disabledFields.splice(0, this.hideFields.length);
    },
    /**
     *  获取当前表单值
     */

    getValues() {
      return this.valuesData;
    },
    /**
     * 创建一个新表单
     */
    addNew(initial = {}) {
      this.clearErrors();
      this.remoteValues = initial;
      this.usePropValues = false;
      this._generateDefaultValues();
    },
    /**
     * 对整个表单进行全局验证
     * 在进行提交及调用valitdate方法时对values进行整体验证证
     */
    _getFullValidator() {
      // {<字段名称>:{..字段Schema..}
      let formSchema = {
        type: "object",
        properties: mergeAll(
          uniq(
            this.getFormFeilds().map(fieldname =>
              fieldname.includes(".") ? fieldname.split(".")[0] : fieldname
            )
          ) //仅仅返回第一级的字段
            .map(fieldname => ({
              [fieldname]: getFieldSchema(fieldname, this.schemaData)
            }))
        )
      };
      // 编译校验器
      try {
        return ajv.compile(formSchema);
      } catch (e) {
        logger.warn(this.$t("richform.compileErr").params(e.message));
        this._validator = null;
      }
    },
    /**
     * 编译Schema以进行验证
     * 用来对每个字段进行单独验证
     *
     */
    _getAloneValidator() {
      //如果validator.on=="none"，则不进行任何验证，因此就不需要创建Ajv
      if (!this._validator) {
        // 生成最终生效的Schema，如果schema里面的数据没有定义在form
        // 只包含定义在form里面的schema
        // {<字段名称>:{..字段Schema..}
        let formSchema = {
          type: "object",
          properties: mergeAll(
            this.getFormFeilds().map(fieldname => ({
              [fieldname]: getFieldSchema(fieldname, this.schemaData)
            }))
          )
        };
        // 编译校验器
        try {
          this._validator = ajv.compile(formSchema);
        } catch (e) {
          logger.warn(this.$t("richform.compileErr").params(e.message));
          this._validator = null;
        }
      }
      return this._validator;
    },
    /**
     * 获取表单字段名称
     *
     */
    getFormFeilds() {
      return $(this.$el)
        .find(".field")
        .map(function() {
          return $(this).attr("name");
        })
        .toArray();
    },
    /**
         *  onlyDirty  : false,           // 仅提交脏值，即只提交修改过的值，
            url        : "",              // 提交的目标url，如果mode=='event'则无效
            // 表单提交方式
            // standard : 标准的表单提交方式，可能会导致页面跳转，在单页应用时代一般很少使用
            // ajax   : 以AJAX方式提交表单
            // event  : 触发submit事件并将值传递给父组件进行处理，
            mode       : "ajax",          
            method     : "post",          // 提交时使用的HTTP 方法，默认是post
            enctype    : "",              // 当需要上传文件时，自动置为multipart/form-data
            query      : {}               // 提交时附加在url上面的查询参数
         */
    async _submitToRemote(params) {
      this.submiting = true;
      if (params == undefined) {
        params = Object.assign({}, this.formData.submit, this.submitParams);
      } else {
        this.submitParams = params;
      }
      if (params.url) {
        try {
          this.uploading = true;
          let submitData = this._getSubmitValues();
          const imgFile = this.valuesData.submitImgFile;
          submitData = dissoc([
            "submitImgFile",
            "uploadImgUrl",
            "image",
            ...this.hideFields,
            ...this.disabledFields
          ])(submitData);
          const { status, payload } = await this.$http({
            method: params.method,
            url: params.url,
            data: submitData,
            api: false
          });
          if (status === "success") {
            // 提交成功时显示的内容
            this.$message.success(this.$t("richform.submitok"));
            this.uploading = false;
            // 如果图片有做修改
            if (imgFile) {
              const uploadImagFileUrl =
                this.valuesData.uploadImgUrl ||
                uploadImgUrl(this.values.type, payload.id);
              let formdata1 = new FormData();
              formdata1.append("img", imgFile);
              let config = {
                headers: {
                  "Content-Type": "multipart/form-data",
                  Authorization: this.token
                }
              };
              const _this = this;
              axios
                .post(uploadImagFileUrl, formdata1, config)
                .then(response => {
                  // 这里的/xapi/upimage为接口
                  _this.$emit("submitImgSuccess");
                });
            }
            // 提交成功时发出的事件
            eventbus.$emit("submitSuccess");
            this.$emit("submitSuccess", payload);
          } else {
            throw new Error("submit form fail: status is not success");
          }
        } catch (e) {
          this.uploading = false;
          this.submiting = false;
          this.formError = e.message;
          this.retryFor = "submit";
          this.$emit("submit", e);
        }
      } else {
        this.formError = this.$t("richform.nourl");
      }
      this.submiting = false;
    },
    _getDirtyValues() {
      let values = {};
      this.dirtyFields.forEach(fieldname => {
        let fieldvalue = getFieldValue(fieldname, this.valuesData);
        setFieldValue(fieldname, fieldvalue, values, false, this.schemaData);
      });
      return Object.assign({}, values, {
        sn: this.valuesData.sn,
        type: this.valuesData.type
      });
    },
    /**
     * 获取要提交的数据
     * 如果onlyDirty=true，则代表只提取修改过的值
     */
    _getSubmitValues(onlyDirty) {
      if (onlyDirty == undefined) onlyDirty = this.submitParams.onlyDirty;
      return onlyDirty ? this._getDirtyValues() : this.valuesData;
    },
    /**
     *  提交表单
     *  {url="",feedback=true,method="post",onlyDirty=false,mode="ajax",query={}}
     *
     **/
    async submit(options = {}) {
      if (Object.keys(this.errors).length !== 0) {
        // 表单存在错误时，返回空
        return this.$notify({
          title: this.$t("richform.verifyerr"), 
          type: "warning"
        });
      }
      if (this.submiting) return;
      this.submiting = true;
      this.loadingText = this.$t("richform.submiting");
      this.submitMethod = "method";
      let valid = true;
      let submitParams = Object.assign({}, this.formData.submit, options);
      //*** 执行校验 */
      if (
        this.formData.validator.on !== "none" &&
        this.formData.validator.on === "submit"
      ) {
        try {
          valid = this.validate(submitParams.feedback);
        } catch (e) {
          this.submiting = false;
          throw e;
        }
      }

      // 开始进行提交
      if (
        valid == true ||
        this.formData.validator.on == "none" ||
        !Object.keys(valid).length
      ) {
        let values = this._getSubmitValues(submitParams.onlyDirty);
        if (submitParams.mode == "event") {
          this.$emit("data", values); // 触发提交事件
        } else {
          await this._submitToRemote(submitParams);
        }
      } else if (submitParams.feedback == false) {
        //如果校验失败，当feedback=true时，错误信息会显示在页面上
        // 如果feedback=false，则触发异常，由父组件进行处理
        throw new Error(this.$t("richform.verifyerr"));
      }
      this.submiting = false;
    },
    /**
     * 执行表单数据校验
     * 校验成功返回true
     * 
     * @param feedback 是否将错误反馈到界面上
     *              =false，则错误不会显示在界面上，而是返回
     *   ｛
     *      <错误的字段名称>:<错误信息>,
     *      <错误的字段名称>:<错误信息>,
     *      .....
     *   ｝
     * 
     */
    validate(feedback = true) {
      this.clearErrors();
      let validate = this._getFullValidator();
      if (!validate) {
        return true;
      }
      let valid = validate(this.valuesData);
      if (valid) {
        return true;
      } else {
        localizeErrors(validate.errors); //国际化
        let errs = this._formatFormErrors(validate.errors);
        if (feedback) {
          Object.keys(errs).forEach(key =>
            this.$set(this.errors, key, errs[key])
          );
        }
        return errs;
      }
    },
    /**
     * 单独校验某个字段
     */
    validateField(fieldname, feedback = true) {
      delete this.errors[fieldname];
      let fieldvalue = getFieldValue(fieldname, this.valuesData);
      let fieldSchema = getFieldSchema(fieldname, this.schemaData);
      let valid = ajv.validate(fieldSchema, fieldvalue);
      if (valid) {
        return true;
      } else {
        localizeErrors(ajv.errors); //国际化
        let errs = this._formatFieldErrors(fieldname, ajv.errors);
        if (feedback) {
          this.$set(this.errors, fieldname, errs);
        }
        return errs;
      }
    },
    /**
     * 生成默认值
     * 在JSON Schema规范中，可以通过default指定默认值
     */
    _generateDefaultValues() {
      if (this.isGenerateDefaultValues) {
        let formFields = this.getFormFeilds();
        formFields.forEach(fieldname => {
          let fieldSchema = getFieldSchema(fieldname, this.schemaData);
          if (!fieldValueIsExists(fieldname, this.valuesData)) {
            try {
              // let defaultValue=fieldSchema.default ? fieldSchema.default : (
              //     {"number":}[fieldSchema.type]
              // )
              setFieldValue(
                fieldname,
                fieldSchema.default,
                this.valuesData,
                false,
                this.schemaData
              );
            } catch (e) {}
          }
        });
      }
    },
    clearErrors() {
      Object.keys(this.errors).forEach(key => this.$delete(this.errors, key));
    },
    /**
            mode={name:<>,value:<>}，如果成员出错
            假设datPath=mode.name，如果表单中有独立的mode字段，则
            应该同时添加errors={mode:<错误信息>,"mode.name":<err>}
            如果存在mode.value的错误，则应将之添加到mode错误中，形成
            errors={mode:<name错误,value错误>，mode.name:<err>,mode.value:<err>}
            当字段存在多级时依此类推,即当字段验证出错时，应将错误添加到其父字段中(如果存在)
                        
         */
    _handleParentFieldErrors(fieldname, err, errors, fieldTips) {
      let names = fieldname.split("."); //names=["a","b","c"]
      let formFields = this.getFormFeilds();
      if (names.length > 1) {
        for (let i = names.length - 1; i > 0; i--) {
          let pname = names.slice(0, i).join(".");
          if (formFields.includes(pname)) {
            if (pname in errors) {
              errors[pname] = errors[pname] + "," + err.message;
            } else {
              errors[pname] = fieldTips + err.message;
            }
          }
        }
      }
    },
    /**
     * 对整个表单的错误进行处理
     * {
     *      <fieldname>:message
     * }
     */
    _formatFormErrors(errs) {
      let _errs = {};
      let formFields = this.getFormFeilds();
      errs.forEach(errItem => {
        let matched = /\.([\w|\.]+)\[*/.exec(errItem.dataPath);
        if (matched) {
          let fieldname = matched[1];
          let schema = getFieldSchema(fieldname, this.schemaData);
          let fieldTips =
            schema.title || schema.name || errItem.dataPath.substr(1);
          if (schema.type == "object") {
            if (formFields.includes(fieldname))
              _errs[fieldname] = `${fieldTips}${errItem.message}`;
          } else if (schema.type == "array") {
            let indexMatched = /\[(\d+)\]/.exec(errItem.dataPath);
            if (indexMatched) {
              if (formFields.includes(fieldname))
                _errs[
                  fieldname
                ] = `${fieldTips}第[${indexMatched[1]}]项${errItem.message}`;
            } else {
              if (formFields.includes(fieldname))
                _errs[fieldname] = `${fieldTips}${errItem.message}`;
            }
          } else {
            // 将字段错误添加到其父字段中(如果存在)
            this._handleParentFieldErrors(fieldname, errItem, _errs, fieldTips);
            if (formFields.includes(fieldname))
              _errs[fieldname] = `${fieldTips}${errItem.message}`;
          }
        }
      });
      return _errs;
    },
    _formatFieldErrors(fieldname, errs) {
      let schema = getFieldSchema(fieldname, this.schemaData);
      return errs
        .map(err => {
          if (typeof err === "string") return err;
          let errMsg = err.message;
          if (
            err.params.allowedValues &&
            Array.isArray(err.params.allowedValues)
          )
            errMsg = errMsg + ":" + JSON.stringify(err.params.allowedValues);
          // 字段名称提示
          let fieldTips = `${schema.title || schema.name}`;
          if (schema.type == "object") {
            if (err.dataPath == "") {
              return errMsg;
            } else {
              let fieldSchema = getFieldSchema(err.dataPath.substr(1), schema);
              return `${fieldSchema.title ||
                fieldSchema.name ||
                err.dataPath.substr(1)}${errMsg}`;
            }
          } else if (schema.type == "array") {
            return `${fieldTips}第[${err.dataPath.substr(
              1,
              err.dataPath.length - 2
            )}]项${errMsg}`;
          } else {
            return errs
              .map(
                err => `${fieldTips || err.dataPath.substr(1)}${err.message}`
              )
              .join(",");
          }
        })
        .join(",");
    }
  }
};
</script>

<style lang="scss">
@import "./vars.scss";
@import "./design/widgets/design.scss";
.richform {
  padding: $md-padding-space;
  position: relative;
  .divider {
    height: 1px;
    width: 100%;
    box-sizing: border-box;
    margin-top: $md-margin-space;
    margin-bottom: $md-margin-space;
  }
  .actions {
    padding: $md-padding-space;
    display: flex;
    flex-direction: row;
    & > .right {
      flex-grow: 1;
      text-align: right;
    }
  }
  &.border {
    border: 1px solid $border-color;
  }
  // 全局加载及提交等错误
  & > .error {
    position: absolute;
    top: 0px;
    bottom: 0px;
    left: 0px;
    right: 0px;
    opacity: 0.85;
    z-index: 10000;
    display: flex;
    background-color: rgba(0, 0, 0, 0.2);
    & > div {
      margin: auto;
      text-align: center;
      color: red;
      & > i {
        font-size: 2em;
        margin: 8px;
      }
      & > .message {
      }
    }
  }
  fieldset {
    padding: 0px;
    margin: 0px;
    border: none;
  }
  &.fit {
    position: absolute;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    box-sizing: border-box;
  }
  &.hide-advanced {
    .advanced {
      display: none;
    }
  }
  ///**********分组***********
  .group {
    width: 100%;
    & > .header {
      display: flex;
      border-bottom: 1px solid #ddd;
      margin-bottom: $md-group-header-margin-space;
      padding: $md-group-header-padding-space;
      margin-top: $md-group-header-margin-space;
      align-items: center;
      cursor: pointer;
      & > .title {
        padding: 4px;
        font-size: $md-group-header-font-size;
        font-weight: bold;
        flex-grow: 1;
      }
      & > a {
        width: 0px;
        height: 0px;
      }
    }
  }
  //*********默认中尺寸表单***********************
  .layout {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    .field {
      position: relative;
      display: flex;
      flex: 1;
      width: 100%;
      // 修复标签与字段同行 align-items: center;
      align-items: left;
      flex-direction: column;
      padding: $md-padding-space;
      font-size: $md-font-size;
      box-sizing: border-box;
      &.hide {
        display: none;
      }
      &.disabled {
        & > label {
          .title {
            color: #ddd;
          }
        }
        & > .value {
          input {
            color: #ddd;
          }
        }
      }
      // 必须字段
      &.required {
        & > .label > .title::before {
          content: "*";
          color: red;
        }
      }
      // 标签
      .label {
        padding: 4px;
        padding-right: 8px;
        align-items: center;
        display: flex;
        position: relative;
        flex-grow: 0;
        flex-shrink: 0;
        & > .title {
          flex-grow: 1;
        }
      }
      //字段值
      .value {
        position: relative;
        flex-grow: 1;
        display: flex;
        flex-direction: column;
      }
      // 错误字段
      &.error {
        align-items: baseline;
        .label {
          & > .title {
            color: $error-color;
          }
        }

        .error {
          color: $error-color;
          font-size: 0.9em;
          padding: 4px 4px 4px 4px;
        }
      }
      .help {
        & > i {
          color: #13ce66;
          padding: 4px;
          cursor: pointer;
        }
      }
      //
      &.inline {
        flex-direction: row;
        align-items: center; // 修复标签与字段同行
        .label {
          flex-grow: 0;
          width: 100px;
        }
        &.wrap {
          flex-wrap: wrap;
        }
      }
    }
    // 水平布局
    &.inline {
      flex-direction: row;
    }
  }
  &.inline .layout {
    flex-direction: row;
  }
  // 不显示文本标签前的:
  &:not(.no-label-suffix) {
    .layout {
      .field {
        & > .label {
          & > .title:after {
            content: ":";
          }
        }
      }
    }
  }
  // 文本标签与字段内容在一行
  &.inline-label {
    .layout {
      .field {
        flex-direction: row;
        align-items: center; // 解决标签与字段同行
        & > .label {
          width: 150px;
          & > .title {
            text-align: right;
            &.center {
              text-align: center;
            }
            &.left {
              text-align: left;
            }
          }
        }
      }
    }
    &.center-label {
      .field > .label > .title {
        text-align: center;
      }
    }
    &.left-label {
      .field > .label > .title {
        text-align: left;
      }
    }
  }

  //*********大尺寸表单*****************************
  &.large {
    padding: $lg-padding-space;
    .layout {
      .field {
        padding: $lg-padding-space;
        font-size: $lg-font-size;
      }
    }
    .divider {
      margin-top: $lg-margin-space;
      margin-bottom: $lg-margin-space;
    }
    .group {
      & > .header {
        margin-bottom: $lg-group-header-margin-space;
        padding: $lg-group-header-padding-space;
        margin-top: $lg-group-header-margin-space;
        & > .title {
          font-size: $lg-group-header-font-size;
        }
      }
    }
    &.inline-label {
      .layout {
        .field {
          & > .label {
            width: 140px;
          }
        }
      }
    }
  }
  //*********小尺寸表单*****************************
  &.small {
    padding: $sm-padding-space;
    .layout {
      .field {
        padding: $sm-padding-space;
        font-size: $sm-font-size;
      }
    }
    .divider {
      margin-top: $sm-margin-space;
      margin-bottom: $sm-margin-space;
    }
    .group {
      & > .header {
        margin-bottom: $sm-group-header-margin-space;
        padding: $sm-group-header-padding-space;
        margin-top: $sm-group-header-margin-space;
        & > .title {
          font-size: $sm-group-header-font-size;
        }
      }
    }
    &.inline-label {
      .layout {
        .field {
          & > .label {
            width: 90px;
          }
        }
      }
    }
  }

  &.grid {
    padding: 0px;
    .field {
      border-right: 1px solid $border-color;
      border-bottom: 1px solid $border-color;
    }
    .group {
      & > .header {
        margin-bottom: 0px;
      }
    }
    &.inline-label {
      .gridline {
        width: 1px;
        background: $border-color;
        margin-left: 4px;
        margin-right: 4px;
        align-self: stretch;
        margin-top: -$md-padding-space;
        margin-bottom: -$md-padding-space;
        flex-grow: 0;
        flex-shrink: 0;
      }
      &.large {
        .gridline {
          margin-top: -$lg-padding-space;
          margin-bottom: -$lg-padding-space;
        }
      }
      &.small {
        .gridline {
          margin-top: -$sm-padding-space;
          margin-bottom: -$sm-padding-space;
        }
      }
    }
    input {
      border: none;
    }
  }
  &.empty {
    .no-ready {
      position: absolute;
      top: 0px;
      bottom: 0px;
      left: 0px;
      right: 0px;
      opacity: 0.85;
      z-index: 9;
      display: flex;
      flex-direction: column;
      & > div {
        margin: auto;
        text-align: center;
        color: #aaa;
        & > i {
          font-size: 2em;
          margin: 8px;
        }
        & > .message {
        }
      }
    }
  }
}
</style>
