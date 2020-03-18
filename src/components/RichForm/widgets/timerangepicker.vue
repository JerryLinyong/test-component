<template>
  <div>
    <el-button
      v-if="field.chooseAll=true"
      :disabled="(field.readOnly||(field.readOnly===undefined&&schema.readOnly))"
      :size="field.size"
      :type="activeBtn==='all'?'success':null"
      @click="()=>{value='';activeBtn='all'}"
      class="btnItem"
    >{{$t("richform.withoutLimit")}}</el-button>
    <el-button
      :disabled="(field.readOnly||(field.readOnly===undefined&&schema.readOnly))"
      :size="field.size"
      :type="activeBtn==='today'?'success':null"
      @click="setDay"
      class="btnItem"
    >{{$t("richform.today")}}</el-button>
    <el-button
      :disabled="(field.readOnly||(field.readOnly===undefined&&schema.readOnly))"
      :size="field.size"
      :type="activeBtn==='week'?'success':null"
      @click="setWeek"
      class="btnItem"
    >{{$t("richform.thisWeek")}}</el-button>
    <el-button
      :disabled="(field.readOnly||(field.readOnly===undefined&&schema.readOnly))"
      :size="field.size"
      :type="activeBtn==='month'?'success':null"
      @click="setMonth"
      class="btnItem"
    >{{$t("richform.thisMonth")}}</el-button>
    <el-button
      :disabled="(field.readOnly||(field.readOnly===undefined&&schema.readOnly))"
      :size="field.size"
      :type="activeBtn==='year'?'success':null"
      @click="setYear"
      class="btnItem"
    >{{$t("richform.thisYear")}}</el-button>
    <el-button
      :disabled="(field.readOnly||(field.readOnly===undefined&&schema.readOnly))"
      :size="field.size"
      :type="activeBtn==='assign'?'success':null"
      @click="activeBtn='assign'"
      class="btnItem"
    >{{$t("richform.assignScope")}}</el-button>
    <el-date-picker
      v-if="activeBtn==='assign'"
      v-model="timeScope"
      :type="field.timeRangeType"
      value-format="timestamp"
      range-separator="-"
      :start-placeholder="$t('richform.startTime')"
      :end-placeholder="$t('richform.endTime')"
    ></el-date-picker>
  </div>
</template>

<script>
import WidgetMixin from "./base.mixin";
import { difference } from "ramda";
import dayjs from "dayjs";
export default {
  name: "TimeRangePickerWidget",
  mixins: [WidgetMixin],
  data() {
    return { activeBtn: "all", timeScope: "" };
  },
  watch: {
    timeScope(newVal) {
      this.value = newVal.join(",");
    },
    value(newVal) {
      if (!newVal) {
        this.activeBtn = "all";
      }
    }
  },
  methods: {
    // 定义一个规范化Schema的方法，用来为组件添加个性化的默认属性
    defaultSchema() {
      return {
        timeRangeType: "daterange",
        chooseAll: true,
        isNeedValidate: false
      };
    },
    // 上传友好值
    emitFriendValue() {
      if (!this.value) {
        this.activeBtn = "all";
      } else {
        this.activeBtn = "assign";
        this.timeScope = this.value.split(",");
      }
    },
    toFieldValue(value) {
      // 规范value的初始值
      return value;
    },
    getFriendValue(value) {
      // 数据的友好显示模式
      if (this.activeBtn === "today") {
        return this.$t("richform.today");
      } else if (this.activeBtn === "week") {
        return this.$t("richform.thisWeek");
      } else if (this.activeBtn === "month") {
        return this.$t("richform.thisMonth");
      } else if (this.activeBtn === "year") {
        return this.$t("richform.thisYear");
      } else if (this.activeBtn === "assign") {
        return value
          .split(",")
          .map(time => dayjs(parseInt(time)).format("YYYY/MM/DD HH:mm:ss"))
          .join("-");
      } else if (this.activeBtn === "all") {
        return "";
      }
    },
    setValue(startTime, endTime) {
      this.value =
        dayjs(startTime)
          .valueOf()
          .toString() +
        "," +
        dayjs(endTime)
          .valueOf()
          .toString();
    },
    setDay() {
      this.activeBtn = "today";
      const startTime = dayjs().format("YYYY-MM-DD");
      const endTime = dayjs(startTime)
        .add(1, "day")
        .format("YYYY-MM-DD");
      this.setValue(startTime, endTime);
    },
    setWeek() {
      this.activeBtn = "week";
      const startTime = dayjs(dayjs().format("YYYY-MM-DD"))
        .subtract(dayjs().get("day") === 0 ? 6 : dayjs().get("day") - 1, "day")
        .format("YYYY-MM-DD");
      const endTime = dayjs(startTime)
        .add(1, "week")
        .format("YYYY-MM-DD");
      this.setValue(startTime, endTime);
    },
    setMonth() {
      this.activeBtn = "month";
      const startTime = dayjs().format("YYYY-MM");
      const endTime = dayjs(startTime)
        .add(1, "month")
        .format("YYYY-MM");
      this.setValue(startTime, endTime);
    },
    setYear() {
      this.activeBtn = "year";
      const startTime = dayjs().format("YYYY");
      const endTime = dayjs(startTime)
        .add(1, "year")
        .format("YYYY");
      this.setValue(startTime, endTime);
    }
  }
};
</script>

<style lang="scss" scoped>
.btnItem {
  // margin: 2px;
  // height: 36px;
  margin: 2px;
  // margin-left: 3px;
}
</style>
