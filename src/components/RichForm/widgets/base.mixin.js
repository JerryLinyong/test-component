/**
 *   Widget
 *
 *
 */

import eventbus from "../eventbus";
import jsonValidator, {
  localize as localizeErrors
} from "@/utils/jsonValidator";
import { type as typename, isEmpty, isNil, pick } from "ramda";

export default {
  inject: ["disabledFields", "hideFields"],
  props: {
    schema: Object, // 传入字段数据
    values: { type: Object, default: () => ({}) },
    form: { type: Object, default: () => ({}) },
    formSchema: { type: Object, default: () => ({}) },
    initial: { type: Object, default: () => ({}) } // 初始值
  },
  computed: {
    value: {
      get: function() {
        this.updateValue++;
        return this.toFieldValue(this.initial.value);
      },
      set(value) {
        this.valueChanged(value);
        if (!this.manualChangeField) {
          this.manualChangeField = true;
        }
      }
    },
    field: function() {
      const defaultField = {
        isNeedValidate: true // 是否需要验证
      };
      let field = Object.assign(
        defaultField,
        this.defaultSchema(),
        this.schema
      );
      if (this.disabledFields.includes(this.schema.name)) {
        field.readOnly = true;
      }
      return field;
    }
  },
  data() {
    return {
      updateValue: 0, // 存在懒加载组件，无法获取相应的数据，当加载完成时强制刷新value值的显示
      enumDict: this.schema.enumDict || this.form.enumDict || {},
      manualChangeField: false, // 如果设置默认值，则value的set不会触发，watch会监听改变，所以这里设置当value默认值触发时，触发set事件
      extraData: null // 与字段相关的额外数据
    };
  },
  async created() {
    eventbus.$on("emitFriendValue", this.emitFriendValue);
    this.getDict();
  },
  async mounted() {
    await this.$nextTick();
    this.updateWidgetView();
    // 默认默认值处理完毕
    this.manualChangeField = true;
  },
  watch: {
    value: function(value) {
      this.updateWidgetView();
      // 处理默认值设置，set不会触发，watch会触发，只执行一次
      if (!this.manualChangeField) {
        this.valueChanged(value);
        this.manualChangeField = true;
      }
    },
    updateValue() {
      // 强制刷新页面，用于懒加载的组件
      this.$forceUpdate();
    }
  },
  methods: {
    // 获取字典
    async getDict() {
      let enumDict;
      // 根据数据的类型在不同的字段获取字典参数
      if (this.schema.type === "array") {
        enumDict = this.schema.items ? this.schema.items.enumDict : undefined;
      } else {
        enumDict = this.schema.enumDict;
      }
      if (enumDict && typeof enumDict === "string") {
        if (this.$store.getters.dicts && this.$store.getters.dicts[enumDict]) {
          this.enumDict = this.$store.getters.dicts[enumDict] || {};
        } else {
          this.enumDict = (await this.$loadDicts(enumDict)) || {};
        }
      } else if (enumDict && typeof enumDict === "object") {
        this.enumDict = enumDict;
      }

      // 如果存在字典过滤，则过滤
      if (Array.isArray(this.schema.dictFilter)) {
        let dictItems = this.schema.dictFilter;
        if (typeof dictItems === "string") {
          dictItems = this.schema.dictFilter.split(",");
        }
        this.enumDict = pick(dictItems)(this.enumDict);
      }
      // 存在字典选项过多,要根据schema过滤字典
      if (Array.isArray(this.schema.enum)) {
        this.enumDict = pick(this.schema.enum)(this.enumDict);
      }
    },
    // value值改变触发的事件
    valueChanged(value) {
      try {
        let v = this.fromFieldValue(value);
        // 某些类型的值不被允许传递,比如[""]
        if (Array.isArray(v)) {
          v = v.filter(val => val !== "");
        }
        const friendValue = this.getFriendValue(v);
        this.$emit(
          "change",
          v,
          friendValue,
          this.getExtraData(),
          this.field.isNeedValidate
        );
      } catch (e) {
        logger.warn(
          this.$t("richform.setValueErr").params(this.schema.name, e.message)
        );
      }
    },
    /**
     * 当viewOnly=true时用来更新显示视图
     */
    updateWidgetView() {
      if (this.form.viewOnly) {
        $("#" + this.form.id)
          .find(`.field[name='${this.schema.name}']`)
          .children(".value")
          .html(`${this.getFriendValue(this.value)}`);
      }
    },
    // 主动设置上传本地数据，用于传入新的values时，显示友好值
    emitFriendValue() {
      if (this.value) {
        const v = this.fromFieldValue(this.value);
        const friendValue = this.getFriendValue(v);
        this.$emit("change", v, friendValue, this.getExtraData());
      }
    },
    // 数据的友好显示模式
    getFriendValue(value) {
      // 如果有字典则自动返回字典对应的值
      let fValue = value;
      const enumDict = this.enumDict;
      if (isEmpty(value) || isNil(value)) {
        fValue =
          this.schema.emptyText == undefined ? "" : this.schema.emptyText;
      } else {
        if (enumDict && typeof enumDict === "object") {
          if (Array.isArray(value)) {
            fValue = value.map(field => {
              let v = enumDict[field] ? enumDict[field].text : "";
              if (isEmpty(value) || isNil(value)) {
                return this.schema.emptyText == undefined
                  ? ""
                  : this.schema.emptyText;
              } else {
                return v;
              }
            });
          } else if (value in enumDict) {
            fValue = enumDict[value].text;
          }
        }
      }
      return fValue;
    },
    getExtraData() {
      return this.extraData;
    },
    setExtraData(value) {
      this.extraData = value;
    },
    /**
     * 当字段widget值发生变化时触发此事件
     * 此时应触发事件，由Field父组件进行处理
     * @param {*} value
     */
    onChange(value) {
      this.$emit(value);
    },
    /**
     * 返回每个字段个性化的Schema字典
     */
    defaultSchema() {
      return {};
    },
    /**
     * 从原始终输入值转换成要适合渲染的值
     * 此方法一般情况下，应该字段组件进行重载
     */
    toFieldValue(value) {
      return value;
    },
    /**
     * 将字段组件输入的结果转换成符合Schema约定的类型
     * 以下执行默认的转换，如果转换不正确，则应该由各个Widget组件自行处理
     */
    fromFieldValue(value) {
      // 类型未定义则返回原值
      if (
        !this.schema ||
        !this.schema.type ||
        this.field.isNeedValidate === false
      )
        return value;
      switch (this.schema.type.toLowerCase()) {
        case "object":
          if (typename(value) == "Object") {
            return value;
          } else {
            try {
              // 如果是字符串，尝试转成[]
              return typeof value == "string" ? JSON.parse(value) : value;
            } catch (e) {
              return value;
            }
          }
          break;
        case "array":
          if (Array.isArray(value)) {
            return value;
          } else {
            try {
              // 如果是字符串，尝试转成[]
              let newVal =
                typeof value === "string" ? JSON.parse(value) : value;
              return Array.isArray(newVal) ? newVal : [newVal];
            } catch (e) {
              return value;
            }
          }
          break;
        case "boolean":
          return typename(value) == "Boolean"
            ? value
            : value
            ? Boolean(value)
            : false;
          break;
        case "number":
          return typename(value) == "Number"
            ? value
            : value
            ? parseFloat(value)
            : value;
          break;
        case "string":
          return typeof value == "string" ? value : value ? String(value) : "";
          break;
        case "integer":
          return typeof value === "number"
            ? value
            : value
            ? parseInt(value)
            : value;
          break;
        default:
          return value;
      }
    },
    /** 在表单总线内触发事件 */
    emit() {
      if (arguments.length > 0) {
        arguments[0] = `${this.form.id}:${arguments[0]}`;
        eventbus.$emit(...arguments);
      }
    },
    /** 侦听表单总线数据 */
    on() {
      if (arguments.length > 0) {
        arguments[0] = `${this.form.id}:${arguments[0]}`;
        eventbus.$on(...arguments);
      }
    },
    /**
     * 对字段执行校验
     */
    validate() {
      const valid = jsonValidator.validate(this.schema, this.value);
      if (valid) {
        this.$emit("validate");
      } else {
        localizeErrors(jsonValidator.errors);
        this.$emit("validate", jsonValidator.errors);
      }
      return valid;
    },
    // 获取当前点击节点的所有父节点Key的拼接。如：a.b.c
    onFindAllParentKey(nodeData, parentKey = "") {
      if (typeof nodeData.key === "undefined") {
        parentKey = parentKey
          .split(".")
          .reverse()
          .join(".");
        parentKey = parentKey.substring(1, parentKey.length);
        return parentKey;
      }
      parentKey += nodeData.key + ".";
      return this.onFindAllParentKey(nodeData.parent, parentKey);
    }
  }
};
