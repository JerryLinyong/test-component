
<template>
  <div>
    <el-time-picker
      v-model="value"
      :readonly="field.readOnly"
      :placeholder="$t('richform.startTime')"
      @blur="changeStartTime"
    ></el-time-picker> -
    <el-time-picker
      v-model="value"
      :readonly="field.readOnly"
      : ="$t('richform.endTime')"
      @blur="changeEndTime"
    ></el-time-picker>
  </div>
</template>

<script>
import mixin from "./base.mixin";
import dayjs from "dayjs";
import parser from "cron-parser";

const DEFAULT_CONTROLLER_TEST = {
  // 计划任务名称
  name: "任务名",
  // 启用/禁用
  enabled: true,
  // 控制内容
  cron: "* * * * * ? *",
  tasks: [{ type: "attr" }]
};

export default {
  name: "TimeControllerWidget",
  mixins: [mixin],
  data() {
    return {
      startTime: "", // 开始时间
      endTime: "" // 结束时间
    };
  },
  watch: {
    value(newVal) {
      console.log(newVal);
      // if(newVal){}
    }
  },
  methods: {
    // 设置获取value时，value值的转换
    // cron
    toFieldValue(value) {
      // 后台传来的cron
      let cron = "15 10 8 * * ?";
      try {
        var interval = parser.parseExpression(cron);
        this.startTime = interval.next()
      } catch (err) {
        console.log("Error: " + err.message);
      }
      return value;
    },
    // 当value变化时设置传递到父组件的value
    // 变成cron
    fromFieldValue(value) {
      // value = 时间
      console.log(value);
      return value;
    },
    // 设置友好值
    getFriendValue(value) {
      return value;
    },
    changeStartTime(time) {
      console.log("start: " + time)
    },
    changeEndTime(time) {
      console.log("end: " + time)
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
