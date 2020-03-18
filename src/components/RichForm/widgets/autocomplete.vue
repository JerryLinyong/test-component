<!-- 
    输入框自动完成渲染组件
    :value-key 显示的键名
-->
<template>
  <el-autocomplete
    ref="autocomplete"
    class="autocomplete-widget"
    :size="form.size"
    v-model="value"
    :value-key="field.valueKey"
    :disabled="disabledFields.includes(field.name)"
    :fetch-suggestions="querySearch"
    :placeholder="field.placeholder"
    :valueKey="field.valueKey"
    :debounce="field.debounce"
    :placement="field.placement"
    :triggerOnFocus="field.triggerOnFocus"
    :prefixIcon="field.prefixIcon"
    :suffixIcon="field.prefixIcon"
    :clearable="field.clearable"
    @select="handleSelect"
  >
    <template slot-scope="{ item }">{{ item[field.valueKey] }}{{ `(${item[field.friendText]}) `}}</template>
  </el-autocomplete>
</template>

<script>
import WidgetMixin from "./base.mixin";
import { getResourcesByType } from "@/api/resources";
import { isObject } from "util";
import Vue from "vue";

export default {
  name: "AutoCompleteWidget",
  mixins: [WidgetMixin],
  data() {
    return {};
  },
  methods: {
    toFieldValue(val) {
      return [undefined, null, NaN].includes(val) ? "" : val + "";
    },
    // 定义一个规范化Schema的方法，用来为组件添加个性化的默认属性,field={}
    defaultSchema() {
      return {
        url: "",
        resourceType: "",
        placeholder: "请输入内容",
        valueKey: "fullname", //主key
        friendText: "title", //额外显示的友好值
        updateFields: {}, // 选择item后需要更新到values的字段 {itemField:valueField}
        value: "",
        debounce: 300,
        placement: "bottom-start",
        popperClass: "",
        triggerOnFocus: false,
        prefixIcon: "",
        suffixIcon: "",
        clearable: true,
        params: {
          pageSize: 20,
          pageNo: 1,
          fields: "fullname,name,certNo", //返回指定的过滤后的字段
          key: "id" //默认搜索的关键字为id
        },
        query: ""
      };
    },
    querySearch(queryString, cb) {
      if (queryString.trim()) {
        let url,
          params,
          query = "";
        if (this.field.query || this.field.query === 0)
          query = `/${this.field.query}`;
        url =
          this.field.resourceType && this.field.resourceType.trim()
            ? `/${this.field.resourceType}${query}`
            : `${this.field.url}${query}`;
        params = Object.assign({}, this.field.params);
        const key = this.field.params.key; //关键字
        params[key] = queryString; //以对应的关键字作为key去搜索
        delete params["key"];
        getResourcesByType(url, params)
          .then(res => {
            if (res.payload.data.length > 0) {
              cb(res.payload.data); //调用 callback 返回建议列表的数据
            } else {
              this.setExtraData(null); //清空额外值
            }
          })
          .catch(err => {
            this.setExtraData(null); //清空额外值
            logger.error(err);
          });
      }
    },
    handleSelect(item) {
      Object.keys(this.field.updateFields).forEach(field => {
        Vue.set(this.values, [this.field.updateFields[field]], item[field]);
      });
      this.$forceUpdate();
      this.setExtraData(item.name ? item.name : item[this.field.valueKey]);
      setTimeout(()=>{ this.setExtraData(null)},2000)
    }
  },
  mounted() {
    // 先触发select事件，在触发value改变事件
    this.$refs.autocomplete.select = item => {
      var _this3 = this.$refs.autocomplete;
      _this3.$emit("select", item);
      _this3.$emit("input", item[_this3.valueKey]);
      _this3.$nextTick(function(_) {
        _this3.suggestions = [];
        _this3.highlightedIndex = -1;
      });
    };
  }
};
</script>

<style lang="scss">
@import "../vars.scss";

.richform {
  .layout {
    .field.error {
      input {
        border: 1px solid $error-color;
        background: transparentize($error-color, 0.8);
      }
    }
  }
}
</style>
