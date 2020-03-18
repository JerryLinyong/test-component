<!--
                schema.name===activeItem?'active-design-item':''

-->
<template>
  <keep-alive>
    <!-- 如果schema只有一个字段，说明schema错误，不显示 -->
    <div
      v-if="schema&&Object.keys(schema).length>1"
      :class="[
                'field',
                {
                    inline:schema.inline,
                    advanced:schema.advanced,
                    required:schema.required,
                    error:schema.name in errors,
                    hide:hideFields.includes(schema.name),
                    disabled:disabledFields.includes(schema.name),
                    'design-visible':(schema.visible===false)&&design,
                    'active-design-item': schema.isClicked&&design,
                    'design-dashed': design // 设计模式虚线边框
                }
            ]"
      :style="{
                'flex-grow':schema.grow==undefined ? null : schema.grow,
                ...(schema.style ? schema.style : {})
            }"
      :name="schema.name"
      @click="onClickedItem(schema)"
    >
      <label
        class="label"
        v-if="schema.showLabel!=false"
        :style="{
                    width:labelWidth,
                    height:labelHeight,
                    ...schema.labelStyle ||{}
                }"
      >
        <span
          :class="['title',{'name-empty-warn':(schema.name.indexOf('hytformdesign#')!==-1||schema.name.length===0)&&design}]"
        >{{ schema.title || schema.name }}</span>
        <div
          class="help"
          :title="schema.description"
          v-show="schema.description && schema.showHelp"
        >
          <i class="el-icon-question"></i>
        </div>
      </label>
      <div v-if="form.grid" class="gridline"></div>
      <div
        :class="['value',{'design-mask':design}]"
        :style="{
                    width : schema.width ==undefined ? null : schema.width,
                    'flex-grow':schema.width == undefined ? 1 : 0,
                    'flex-shrink':schema.width == undefined ? 1 : 0,
                    ...schema.valueStyle ||{}
                }"
      >
        <component
          :is="asyncFieldComponent"
          :schema="schema"
          :values="values"
          :form="form"
          :form-schema="formSchema"
          :initial="fieldValue"
          @change="change"
          @validate="validate"
          v-bind="$attrs"
          v-on="$listeners"
        />
        <span class="error" v-if="schema.name in errors">
          <i class="el-icon-warning-outline"></i>
          {{ errors[schema.name] }}
        </span>
      </div>
      <!--拖拽-->
      <span v-if="design&&schema.isClicked" class="design-draggable design-handle-move">
        <i class="el-icon-rank design-handle-move"></i>
      </span>
      <!--复制-->
      <span v-if="design&&schema.isClicked" class="design-copy" @click="onCopyItem(schema)">
        <i class="el-icon-document-copy"></i>
      </span>
      <!--删除-->
      <span v-if="design&&schema.isClicked" class="design-delete" @click="onDeleteItem(schema)">
        <i class="el-icon-delete"></i>
      </span>
    </div>
  </keep-alive>
</template>
<script>
import { getFieldSchema, getFieldValue, setFieldValue } from "./utils";
import jsonValidator, { localize as localizeErrors } from "./validator";
import eventbus from "./eventbus";
import { isNil, isEmpty } from "ramda";
import DragMixin from "./design/widgets/design.mixin";

export default {
  inject: ["errors", "hideFields", "disabledFields"],
  mixins: [DragMixin],
  props: {
    schema: { type: Object, required: true, default: () => {} },
    // widget:{type:String,default:'textbox'},// 异步加载组件会因为props的schema变化多次渲染，在此只监听widget，防止多次异步渲染组件
    form: { type: Object, default: () => {} },
    formSchema: { type: Object, default: () => {} },
    values: { type: Object, default: () => {} },
    keepAlive: { type: Boolean, default: true }, // 是否保持缓存
    delay: { type: Number, default: 20 }, // 延迟加载时间
    timeout: { type: Number, default: 2000 }, // 超时警告时间
    design: { type: Boolean, default: false }
  },
  computed: {
    labelInline() {
      return this.form.labelInline;
    },
    /**
     *  如果labelInline=true并且指定了labelWidth，则使用该宽度,
     *  如果field.inline=true,则使用field.labelWidth || form.labelWidth
     */
    labelWidth() {
      let hasLabelWidth = this.schema.labelWidth || this.form.labelWidth;
      let labelWidth = hasLabelWidth
        ? parseInt(this.schema.labelWidth || this.form.labelWidth) + "px"
        : "";
      return this.schema.inline
        ? labelWidth
        : this.form.labelInline
        ? labelWidth
        : "";
    },
    labelHeight() {
      let hasLabelHeight = this.schema.labelHeight || this.form.labelHeight;
      let labelHeight = hasLabelHeight
        ? parseInt(this.schema.labelHeight || this.form.labelHeight) + "px"
        : "40px";
      return labelHeight;
    },
    fieldValue: {
      get() {
        const update = this.update; // 用于刷新，不可删除,一旦删除，提交表单若有验证失败，则无法再此编辑表单
        let value = getFieldValue(this.schema.name, this.values);
        if (
          typeof value === "object" &&
          (this.schema.widget === "textbox" || !this.schema.widget)
        ) {
          logger.error("text表单的字段错误,禁止value显示为object");
        }
        return {
          value: value === undefined && !update ? this.schema.default : value
        };
      },
      set(value) {
        try {
          setFieldValue(
            this.schema.name,
            value,
            this.values,
            false,
            this.formSchema
          );
          // get事件不会触发，所以这里要手动触发更新
          ++this.update;
        } catch (e) {
          logger.warn(
            this.$t("richform.setValueErr").params(fieldname, e.message)
          );
        }
      }
    },
    asyncFieldComponent() {
      let widget = this.schema.widget;
      if (widget == undefined || isNil(widget) || isEmpty(widget)) {
        widget = "textbox";
      }
      widget = widget.toLowerCase();
      const delay = this.delay;
      const timeout = this.timeout;
      return function() {
        return {
          component: import(`./widgets/${widget}`),
          loading: {
            template:
              '<div style="height: 100%; width: 100%; display: table;"><div style="display: table-cell; vertical-align: middle; text-align: center;"><div>加载中</div></div></div>'
          },
          error: {
            template:
              '<div style="height: 100%; width: 100%; display: table;"><div style="display: table-cell; vertical-align: middle; text-align: center;"><div>加载错误</div></div></div>'
          },
          delay,
          timeout
        };
      };
    }
  },
  data() {
    return {
      update: 0
    };
  },
  methods: {
    emit() {
      if (arguments.length > 0) {
        arguments[0] = `${this.form.id}:${arguments[0]}`;
        eventbus.$emit(...arguments);
      }
    },
    /** */

    on() {
      if (arguments.length > 0) {
        arguments[0] = `${this.form.id}:${arguments[0]}`;
        eventbus.$on(...arguments);
      }
    },
    /**
     * 格式化错误信息
     */
    formatErrorMessage(errs) {
      if (this.schema.type == "object") {
        return errs.map(err => err.message).join(",");
      } else {
        return errs.map(err => err.message).join(",");
      }
    },
    /**
     * 对字段执行校验
     * 如果成功，则触发error事件
     */
    validate() {
      let valid = jsonValidator.validate(this.schema, this.fieldValue.value);
      if (valid) {
        this.emit("field:valid", this.schema.name);
      } else {
        localizeErrors(jsonValidator.errors);
        // 存在后端的错误keyword与jsonvalidator错误字段不符合,导致错误无法显示
        let errors = jsonValidator.errors.map(error => {
          if (
            this.schema.errorMessage &&
            this.schema.errorMessage[error.keyword]
          ) {
            return this.schema.errorMessage[error.keyword];
          } else {
            return error.message;
          }
        });
        this.emit("field:error", this.schema.name, errors);
      }
      return valid;
    },
    /**
     * 当值发生变化时调用此函数
     */
    change(value, friendValue, extraData, isNeedValidate = true) {
      try {
        this.fieldValue = value;
        this.emit(
          "field:change",
          this.schema.name,
          value,
          friendValue,
          extraData
        );
        if (
          this.form.validator.on == "input" ||
          this.form.validator.on == "change"
        )
          if (isNeedValidate) {
            this.validate();
          }
      } catch (e) {
        logger.warn(
          this.$t("richform.setValueErr").params(this.schema.name, e.message)
        );
      }
    }
  },
  created() {},
  mounted() {}
};
</script>

<style lang="scss">
.field {
  position: relative;
}
</style>>