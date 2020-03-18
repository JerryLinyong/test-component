<!--
  与通用版本相比修改了getAttrs方法和readOnly
 -->
<template>
  <div class="device-timing-controller">
    <div v-if="field.readOnly" class="block-div"></div>
    <div v-if="controllers.length===0" class="defalut-add-button">
      <i class="el-icon-circle-plus" @click="addController"></i>
    </div>
    <cron
      v-show="isShowCron"
      :i18n="language==='zh-cn'?'cn':'en'"
      @change="changeCron"
      @close="isShowCron=false"
    ></cron>
    <div
      v-show="!isShowCron"
      class="controller-item"
      v-for="(controller,index) in controllers"
      :key="index"
    >
      <el-input v-model="controller.name" placeholder="请输入名称" class="item-name"></el-input>
      <div class="cron" @click="onCronClick(index)">
        <el-input slot="reference" :value="controller.cron" placeholder="请输入定时策略"></el-input>
      </div>
      <el-dropdown @command="(command)=>selectTask(command,index)">
        <span class="el-dropdown-link">
          {{controller.tasks[0].type==='attr'?'修改属性':'执行动作'}}
          <i
            class="el-icon-arrow-down el-icon--right"
          ></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="attr">修改属性</el-dropdown-item>
          <el-dropdown-item command="act">执行动作</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <template v-if="controller.tasks[0].type==='attr'">
        <el-dropdown @command="(command)=>selectAttr(command,index)">
          <span class="el-dropdown-link">
            {{getAttrName(controller.tasks[0].name)}}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <PerfectScrollbar style="height:300px">
              <el-dropdown-item
                v-for="(attr,index) in attrs"
                :key="attr.name+index"
                :command="{name:attr.name,type:attr.type}"
              >{{attr.title}}</el-dropdown-item>
            </PerfectScrollbar>
          </el-dropdown-menu>
        </el-dropdown>
        <template v-if="controller.tasks[0].name">
          <el-switch
            @change="updatedController"
            v-if="typeof controller.tasks[0].value==='boolean'"
            v-model="controller.tasks[0].value"
            active-color="#13ce66"
          ></el-switch>
          <MyInput
            v-else
            @change="(value)=>onFieldInputChange(value,controller)"
            :value="controller.tasks[0].value"
            placeholder="请输入值"
          ></MyInput>
        </template>
      </template>
      <template v-else>
        <el-dropdown @command="(command)=>selectAction(command,index)">
          <span class="el-dropdown-link">
            {{controller.tasks[0].name?deviceActions[controller.tasks[0].name].title:'请选择动作'}}
            <i
              class="el-icon-arrow-down el-icon--right"
            ></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-for="action in deviceActions"
              :key="action.name"
              :command="action.name"
            >{{action.title}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <RichForm
          v-if="controller.tasks[0].params"
          :values="controller.tasks[0].params"
          @fieldchange="(name, value)=>onActionFieldChange(name, value,controller)"
          autoForm
          :schema="deviceActions[controller.tasks[0].name].paramSchema"
        />
      </template>
      <div class="item-controller">
        <span>启用：</span>
        <el-switch v-model="controller.enabled" active-color="#13ce66"></el-switch>
        <div class="actions">
          <i class="el-icon-circle-plus" @click="addController(index)"></i>
          <i class="el-icon-error" @click="checkDeleteController(index)"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { cron } from "vue-cron";
import mixin from "./base.mixin";
import { remove, insert } from "ramda";
import { get } from "vuex-pathify";
import Vue from "vue";
import RichForm from "@/components/RichForm";
import { getDeviceInfo } from "@/api/devices";
import { isEmpty } from "xe-utils";
import { PerfectScrollbar } from "vue2-perfect-scrollbar";
import MyInput from "@/components/Input";
import unflattenObj from "@/utils/unflattenObj";
import flattenObj from "@/utils/fattenObj";
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
  name: "DeviceTimingControllerWidget",
  mixins: [mixin],
  components: { cron, RichForm, PerfectScrollbar, MyInput },
  data() {
    return {
      controllers: [{ ...DEFAULT_CONTROLLER_TEST }],
      isShowCron: false,
      currentIndex: 0,
      deviceActions: []
    };
  },
  computed: {
    language: get("my/language"),
    attrs() {
      let attrs = this.getAttrs(Object.values(this.formSchema.properties));
      return Array.isArray(attrs) ? attrs : [];
    }
  },
  watch: {
    controllers: {
      handler(newVal) {
        this.value = newVal.map(val => {
          let newTasks = val.tasks.map(task => {
            let newTask = Object.assign({}, task);
            if (newTask.type === "attr" && newTask.name) {
              let nameArr = newTask.name.split(".");
              if (nameArr.length > 1) {
                newTask.name = nameArr[0];
                nameArr.shift();
                newTask.value = unflattenObj({
                  [nameArr.join(".")]: newTask.value
                });
              }
            }
            return newTask;
          });
          return Object.assign({}, val, { tasks: newTasks });
        });
      },
      deep: true
    }
  },
  created() {
    this.getDeviceActions();
  },
  mounted() {
    if (Array.isArray(this.value)) {
      this.controllers = this.value.map(val => {
        let newTasks = val.tasks.map(task => {
          let newTask = Object.assign({}, task);
          if (newTask.type === "attr" && typeof newTask.value === "object") {
            let flattenVal = flattenObj({ [newTask.name]: newTask.value });
            let newVal = Object.values(flattenVal)[0];
            let newName = Object.keys(flattenVal)[0];
            newTask.name = newName;
            newTask.value = newVal + "";
          }
          return newTask;
        });
        return Object.assign({}, val, { tasks: newTasks });
      });
    }
  },
  methods: {
    onFieldInputChange(value, controller) {
      controller.tasks[0].value = value;
      this.updatedController();
    },
    onActionFieldChange(name, value, controller) {
      controller.tasks[0].params = Object.assign(
        {},
        controller.tasks[0].params,
        { [name]: value }
      );
      this.updatedController();
    },
    updatedController() {
      this.controllers = [...this.controllers];
    },
    getAttrName(name) {
      let attrName = "";
      if (!name) {
        attrName = "请选择属性值";
      } else {
        let schema = this.formSchema.properties;
        let nameArr = name.split(".");
        nameArr.forEach((key, index) => {
          if (index === nameArr.length - 1) {
            attrName = schema[key].title;
          } else {
            schema = schema[key].properties;
          }
        });
      }
      return attrName;
    },
    // @ params {array}
    getAttrs(properties) {
      let attrs = [];
      function getPro(pros) {
        pros.forEach(property => {
          if (
            property.properties &&
            !isEmpty(property.properties) &&
            property.name
          ) {
            let newProperties = Object.values(property.properties);
            let newAttrs = newProperties.map(item => {
              let newItem = { ...item };
              newItem.name = property.name + "." + item.name;
              return newItem;
            });
            getPro(newAttrs);
          } else if (
            !property.type ||
            !["object", "array"].includes(property.type.toLowerCase())
          ) {
            if (property.name) {
              attrs.push(property);
            }
          }
        });
      }
      getPro(properties);
      return attrs;
    },
    async getDeviceActions() {
      try {
        const { status, payload } = await getDeviceInfo(this.values.type, {
          category: "actions"
        });
        if (status === "success") {
          this.deviceActions = payload;
        }
      } catch (e) {
        logger.error("获取设备的动作失败:" + e);
      }
    },
    selectAttr(attr, index) {
      let controllerExecute = this.controllers[index].tasks[0];
      controllerExecute.name = attr.name;
      if (attr.type === "boolean") {
        controllerExecute.value = false;
      } else {
        controllerExecute.value = "";
      }
      this.updatedController();
    },
    selectAction(action, index) {
      let controllerExecute = this.controllers[index].tasks[0];
      controllerExecute.name = action;
      if (
        this.deviceActions[action].paramSchema &&
        !isEmpty(this.deviceActions[action].paramSchema.properties)
      ) {
        controllerExecute.params = {};
      } else {
        controllerExecute.params = null;
      }
      this.updatedController();
    },
    selectTask(command, index) {
      this.controllers[index].tasks = [{ type: command }];
    },
    onCronClick(index) {
      this.isShowCron = true;
      this.currentIndex = index;
    },
    checkDeleteController(index) {
      this.$confirm(
        this.$t("common.checkDelete").params(this.controllers[index].name),
        {
          type: "warning"
        }
      )
        .then(() => {
          this.controllers = remove(index, 1)(this.controllers);
        })
        .catch(e => {});
    },
    addController(index = -1) {
      const DEFAULT_CONTROLLER = {
        // 计划任务名称
        name: "任务名",
        // 启用/禁用
        enabled: true,
        // 控制内容
        cron: "* * * * * ? *",
        tasks: [{ type: "attr" }]
      };
      this.controllers = insert(index + 1, { ...DEFAULT_CONTROLLER })(
        this.controllers
      );
    },
    changeCron(val) {
      this.controllers[this.currentIndex].cron = val;
    },
    // 定义一个规范化Schema的方法，用来为组件添加个性化的默认属性
    // 对应字段为 field
    defaultSchema() {
      return {
        placeholder: "",
        readOnly: this.form.readOnly,
        isNeedValidate: false
      };
    },
    // 设置获取value时，value值的转换
    toFieldValue(value) {
      return value;
    },
    // 当value变化时设置传递到父组件的value
    fromFieldValue(value) {
      return value;
    },
    // 设置友好值
    getFriendValue(value) {
      return value;
    }
  }
};
</script>

<style lang="scss">
.device-timing-controller {
  .block-div {
    height: 100%;
    width: 100%;
    position: absolute;
    z-index: 100;
  }
  .defalut-add-button {
    text-align: right;
    i {
      margin-right: 20px;
      font-size: 30px;
    }
    i:hover {
      color: #409eff;
    }
  }
  .controller-item {
    display: flex;
    align-items: center;
    margin-top: 6px;
    & > div {
      margin-left: 10px;
      text-align: center;
      flex: 4;
    }
    .el-input {
      width: 150px;
    }
    .item-controller {
      display: flex;
      flex: 5;
      align-items: center;
      justify-content: flex-end;
      .actions {
        i {
          margin-left: 8px;
          font-size: 18px;
        }
        i:hover {
          color: #409eff;
        }
      }
    }
  }
}
</style>
