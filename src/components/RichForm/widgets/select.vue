

<template>
  <el-select
    class="select-widget"
    v-model="value"
    :disabled="field.readOnly||form.readOnly"
    :multiple="field.multiple"
    :placeholder="field.placeholder"
    :filterable="field.filterable"
    :clearable="field.clearable"
    :collapse-tags="field.collapseTags"
  >
    <el-option
      v-for="option in enumDict"
      :key="option.value"
      :label="option.text"
      :value="option.value"
      :disabled="field.readOnly"
    ></el-option>
  </el-select>
</template>

<script>
import WidgetMixin from "./base.mixin";
import { getResourcesByType } from "@/api/resources";
import { dissoc } from "ramda";
import { get, call, sync } from "vuex-pathify";
export default {
  name: "SelectWidget",
  mixins: [WidgetMixin],

  computed: {
    resourceInfos: get("resourceinfos"),
    pk() {
      const resourceinfos = this.$store.state.resourceinfos;
      return resourceinfos[this.field.resourceType] &&
        resourceinfos[this.field.resourceType].pk
        ? resourceinfos[this.field.resourceType].pk
        : "";
    }
  },
  watch: {
    pk: {
      handler(newVal) {
        if (newVal) {
          this.initSelectData();
        }
      },
      deep: true
    }
  },
  methods: {
    defaultSchema() {
      return {
        isNeedValidate: false,
        placeholder: "",
        clearable: true,
        password: false,
        filterable: false, // 是否可搜索
        suffixIcon: null, //前置图标
        prifixIcon: null, //后置图标
        prepend: null, //前置内容
        append: null, //后置内容
        multiple: false,
        url: null,
        resourceCollection: null,
        resourceType: null,
        collapseTags: false,
        params: {}
      };
    },
    // 获取资源的pk值
    getResourcePk: call("resourceinfos/loadResourceInfos"),
    // 修改显示值
    // el-select如果是单选则value为string，多选为array，后端传来的数据可能为obj，array，string，修改为el-select组件可以显示的形式string和[string]
    toFieldValue(value) {
      if (typeof value === "object") {
        // 处理数组，item为对象或者字符串的情况
        if (!Array.isArray(value)) {
          // return value[this.pk]
          return value["id"];
        } else {
          if (this.schema.items && this.schema.items.type === "object") {
            if (this.field.multiple) {
              //多选
              // return value.map(valueItem=>valueItem[this.pk])
              return value.map(valueItem => valueItem["id"]);
            } else {
              //单选
              return value.length > 0 ? value[0].text : "";
            }
          } else {
            return value;
          }
        }
      } else if (typeof value === "string" && value) {
        if (this.schema.type === "array") {
          return value.split(",");
        }
      }
      return value;
    },
    // 修改上传值,value如果为单选，必然传递为字符串，多选为数组，根据后端要求修改value的type
    fromFieldValue(value) {
      // 处理多选
      if (Array.isArray(value)) {
        // value为array，item为字符串和对象的类型
        if (this.schema.items && this.schema.items.type === "object") {
          // 如果后端要求array里面的item为对象
          let dicts = this.enumDict.filter(dict => value.includes(dict.value));
          return dicts.map(dict => dissoc("value")(dict));
        } else if (this.schema.items && this.schema.items.type === "string") {
          return value;
        }
        // 否则默认提交的array里的item为string型
        return value;
      }
      // 处理单选
      if (typeof value === "string") {
        // 处理单选时值为字符串但提交的数据要为array类型数据的情况
        if (
          this.schema.type.toLowerCase() === "array" &&
          this.schema.items &&
          this.schema.items.type === "object"
        ) {
          value = [value];
          let dicts = this.enumDict.filter(dict => value.includes(dict.value));
          return dicts.map(dict => dissoc("value")(dict));
        } else if (this.schema.type.toLowerCase() === "array") {
          return [value];
        }
        // 处理单选时值为字符串但提交的数据要为object类型数据的情况
        else if (this.schema.type.toLowerCase() === "object") {
          // 如果后端要求为object，则修改为object
          const dicts = this.enumDict.filter(dict => dict.value === value);
          return dicts.length ? dissoc("value")(dicts[0]) : value;
        } else {
          // 否则默认传string
          return value;
        }
      }
      return value;
    },
    // 下拉显示的数据
    initSelectData() {
      getResourcesByType(
        `/resourcetypes/${this.field.resourceType}/resources`,
        this.field.params
      ).then(res => {
        const resources = res.payload.data;
        const pk = this.field.friendPk || this.pk; //(friendPk)可以在richForms定义
        this.enumDict = resources.map(
          ({ [pk]: value, name, type, fullname, title }) => {
            return {
              value,
              id: name ? name : value,
              type,
              text: fullname ? fullname : title,
              title: fullname ? fullname : title
            };
          }
        );
      });
    },
    initSettings() {
      if (this.field.resourceType) {
        if (!this.pk) {
          this.getResourcePk({
            resType: this.field.resourceType,
            category: "pk"
          });
        } else {
          this.initSelectData();
        }
      }
    }
  },
  created() {
    this.initSettings();
  }
};
</script>

<style lang="scss" scoped>
</style>
