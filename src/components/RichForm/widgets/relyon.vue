<!--
  验证依赖关系
  验证格式
    1、数字
    小于 < : {"xxx": {exclusiveMaximum: 4}}
    小于等于 <=：{"xxx": {maximum: 3}}
    大于： > : {"xxx": {exclusiveMinimum: 4}}
    大于等于 >=：{"xxx": {minimum: 4}}
    不等于： !=: {"xxx": { "not": {const: true}}}
    或关系：
          enabled: {
            "mode.value": { maximum: 3 },
            "network.dhcp": { const: true }
          }
    2、布尔值
    { "network.dhcp": { const: false } }
    3、字符串长度
    最大长度：{"xxx": {maxLength: 4}}
    最小长度：{"xxx": {minLength: 4}}
    正则表达式：{"xxx": {"pattern": "\\d+_\\d+_\\d+"}}
-->
<template>
  <div class="verification-dependency">
    <el-button @click="dialogVisible = true">{{selectedType}}</el-button>
    <el-dialog
      width="45%"
      :title="`字段<${field.descriptionTitle}>${field.title}`"
      :visible.sync="dialogVisible"
      :modal-append-to-body="false"
    >
      <div class="dialog-body">
        <!-- 单选条件 -->
        <el-radio-group v-model="typeRadio">
          <el-radio v-for="type in typeData" :key="type.id" :label="type.id">{{ type.text }}</el-radio>
        </el-radio-group>
        <!-- 添加条件容器 -->
        <div v-show="typeRadio === 'condition'" class="addition-condition-container">
          <div class="condition-title">当满足以下条件时,字段可见</div>
          <!-- 条件 -->
          <div v-for="(formula, index) in formulaData" :key="formula.id">
            <div
              class="condition-item"
              @mouseover="onGettingRelationItem(formula)"
              @mouseout="onHideDelBtn"
            >
              <el-popover placement="left" title="数据模型" width="200" trigger="hover">
                <el-tree
                  :data="field.treeSource"
                  :props="defaultProps.treeKeyMap"
                  :node-key="field.treeKey || defaultProps.treeKeyMap.key"
                  @node-click="onClickTreeNode"
                  default-expand-all
                ></el-tree>
                <el-button slot="reference">{{formula.treeTitle}}</el-button>
              </el-popover>
              <el-select v-model="formula.relation" placeholder="请选择">
                <el-option
                  v-for="optionItem in relationItem.relationOptions"
                  :key="optionItem.value"
                  :label="optionItem.label"
                  :value="optionItem.value"
                ></el-option>
              </el-select>
              <el-input :placeholder="'请输入'+ formula.type  + '类型'" v-model="formula.value"></el-input>
              <i
                :class="['el-icon-circle-close',' delete-condition-item',{'active-delete-item': formula.id === activeDeleteItem}]"
                @click="onDeleteCondition(formula)"
              ></i>
            </div>
          </div>
          <span class="add-condition" @click="onAdditionCondition">添加条件</span>
        </div>
      </div>
      <!-- 按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onChecked">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import WidgetMixin from "./base.mixin";

export default {
  name: "VerificationDependency",
  mixins: [WidgetMixin],
  computed: {},
  data() {
    return {
      defaultProps: {
        // 默认条件
        treeKeyMap: {
          // 树字段MAP
          label: "title",
          key: "name"
        }
      },
      typeRadio: "请选择", // 显示类别
      typeData: [
        // 类别选项
        {
          id: "yes",
          text: "是"
        },
        {
          id: "no",
          text: "否"
        },
        {
          id: "condition",
          text: "指定条件"
        }
      ],
      selectedType: "请选择", // 显示的列别
      dialogVisible: false, // 弹框是否显示
      selectedRelation: "", // 下拉选框已经择项
      relationItem: {}, // 当前关系式的item
      relationOptions: [
        // 关系等式类型
        {
          value: "=",
          label: "等于",
          type: ["string", "boolean", "number"]
        },
        {
          value: "!=",
          label: "不等于",
          type: ["string", "boolean", "number"]
        },
        {
          value: ">",
          label: "大于",
          type: ["number"]
        },
        {
          value: ">=",
          label: "大于等于",
          type: ["string", "number"]
        },
        {
          value: "<",
          label: "小于",
          type: ["number"]
        },
        {
          value: "<=",
          label: "小于等于",
          type: ["string", "number"]
        },
        {
          value: "regularExpression",
          label: "正则表达式",
          type: ["string"]
        },
        {
          value: "range",
          label: "指定范围",
          type: []
        }
      ],
      relationMap: {
        // 等式映射关系
        number: {
          "=": "const",
          "!=": "not",
          "<": "exclusiveMaximum",
          "<=": "maximum",
          ">": "exclusiveMinimum",
          ">=": "minimum"
        },
        boolean: {
          "=": "const",
          "!=": "not"
        },
        string: {
          "=": "const",
          "!=": "not",
          "<=": "maxLength",
          ">=": "minLength",
          regularExpression: "pattern"
        }
      },
      treeRelationItem: "", // 条件公式的item
      formulaData: [], // 条件公式
      activeDeleteItem: "", // 显示删除按钮
      showOnce: true
    };
  },
  methods: {
    // 显示前转换
    toFieldValue(value) {
      this.selectedType = "是";
      this.typeRadio = "yes";
      if (value.length === 0) {
        this.value = true;
      }
      if (value === true) {
        this.selectedType = "是";
        this.typeRadio = "yes";
      } else if (value === false) {
        this.selectedType = "否";
        this.typeRadio = "no";
      } else if (Object.keys(value).length > 0) {
        this.selectedType = "指定条件";
        this.typeRadio = "condition";
        if (this.showOnce) {
          // 显示已经选择的条件
          this.onValueToRelation(value);
          this.showOnce = false;
        }
      }
      if (this.formulaData.length === 0) {
        this.formulaData.push({
          // 模板
          id: new Date().getTime().toString(),
          name: "",
          relation: "",
          value: "",
          type: "", // 用于placeholder
          isNeedValidate: true,
          treeTitle: "选择字段",
          relationOptions: []
        });
      }
      return value;
    },
    // 添加条件
    onAdditionCondition() {
      // 判断最后一个条件是否填完整
      let lastFormulaItem = this.formulaData[this.formulaData.length - 1];
      let isLastItemFillIn = Object.keys(lastFormulaItem).some(key =>
        lastFormulaItem[key].length === 0 ? true : false
      );
      // 执行添加动作
      if (!isLastItemFillIn) {
        this.formulaData.push({
          // 模板
          id: new Date().getTime().toString(),
          name: "",
          relation: "",
          value: "",
          type: "", // 用于placeholder
          isNeedValidate: true,
          treeTitle: "选择字段",
          relationOptions: []
        });
      } else {
        this.$message({
          message: "请先填完整最后一条信息！",
          type: "warning"
        });
      }
    },
    // 删除条件
    onDeleteCondition(formula) {
      if (this.formulaData.length === 0) {
        return;
      }
      this.formulaData.forEach((formulaItem, index) => {
        if (formulaItem.id === formula.id) {
          this.$delete(this.formulaData, index);
        }
      });
    },
    // 获取当前的关系式item
    onGettingRelationItem(formula) {
      this.relationItem = formula;
      // 显示删除按钮
      this.activeDeleteItem = formula.id;
    },
    // 隐藏删除按钮
    onHideDelBtn() {
      this.activeDeleteItem = "";
    },
    // 树点击事件
    onClickTreeNode(clickItem, nodeData) {
      // 获取所有父节点
      const allParentKey = this.onFindAllParentKey(nodeData);
      // 当前关系式给对应字段赋值
      this.$set(this.relationItem, "name", allParentKey);
      this.$set(this.relationItem, "type", clickItem.type);
      this.$set(this.relationItem, "treeTitle", clickItem.title);
      // 根据当前的type，查找符合当前ITEM的关系等式
      let currentTypeOption = this.onTypeFindRelation(clickItem.type);
      // 先清空，避免键值重复.再赋值
      this.$set(this.relationItem, "relationOptions", []);
      this.$set(this.relationItem, "relationOptions", currentTypeOption);
    },
    // 根据type找符合的等式选项
    onTypeFindRelation(type) {
      let currentTypeOption = [];
      this.relationOptions.forEach(relationItem => {
        if (relationItem.type.includes(type.toLowerCase())) {
          currentTypeOption.push(relationItem);
        }
      });
      return currentTypeOption;
    },
    // 确认操作
    onChecked() {
      if (this.typeRadio === "yes") {
        this.selectedType = "是";
        this.value = true;
      } else if (this.typeRadio === "no") {
        this.selectedType = "否";
        this.value = false;
      } else if (this.typeRadio === "condition") {
        this.selectedType = "指定条件";
        let validRegular = {};
        this.formulaData.forEach(item => {
          validRegular[item.name] = this.onRelationToValue(item);
        });
        this.value = validRegular;
      }
      this.dialogVisible = false;
    },
    // 将关系式转为ajv验证格式的值
    onRelationToValue(formula) {
      let relationMapKey = formula.type.toLowerCase();
      let equalityRelation = this.relationMap[relationMapKey][formula.relation];
      switch (relationMapKey) {
        case "number":
          return {
            [equalityRelation]:
              formula.relation === "!="
                ? { const: parseInt(formula.value) }
                : parseInt(formula.value)
          };
          break;
        case "boolean":
          let bool = formula.value === "true" ? true : false;
          return {
            [equalityRelation]:
              formula.relation === "!=" ? { const: bool } : bool
          };
          break;
        case "string":
          if (
            formula.relation === "=" ||
            formula.relation === "!=" ||
            formula.relation === "regularExpression"
          ) {
            return {
              [equalityRelation]:
                formula.relation === "!="
                  ? { const: formula.value.toString() }
                  : formula.value.toString()
            };
          }
          return {
            [equalityRelation]: parseInt(formula.value)
          };
          break;
      }
    },
    // 根据keys去查找标题
    onKeysGettingTitle(source, keys = [], index = 0) {
      for (let key in source) {
        if (typeof source[key] === "object") {
          if (source[key].name === keys[index] && keys.length - 1 >= index) {
            if (keys.length - 1 === index) {
              this.treeRelationItem = source[key];
              return;
            }
            index += 1;
          }
          this.onKeysGettingTitle(source[key], keys, index);
        }
      }
    },
    // 将ajv验证格式的值转为关系式，用于初始化显示
    onValueToRelation(value) {
      Object.keys(value).map(nameKey => {
        let allKeys = nameKey.split(".");
        this.onKeysGettingTitle(this.field.treeSource, allKeys);
        let type = this.treeRelationItem.type.toLowerCase();
        let relationOptions = this.onTypeFindRelation(type);
        // 值找键值获取relation
        let relation = Object.keys(this.relationMap[type]).find(
          relationMapKey =>
            this.relationMap[type][relationMapKey] ===
            Object.keys(value[nameKey])[0]
              ? relationMapKey
              : ""
        );
        let val = Object.keys(value[nameKey]).map(relationKey =>
          relationKey !== "not"
            ? value[nameKey][relationKey]
            : value[nameKey][relationKey]["const"]
        );
        let treeTitle = this.treeRelationItem.title;
        this.formulaData.push({
          id: new Date().getTime().toString() + parseInt(Math.random() * 100),
          name: nameKey,
          relation: relation,
          value: val.toString(),
          type: type, // 用于placeholder
          isNeedValidate: true, // 是否需要验证
          treeTitle: treeTitle,
          relationOptions: relationOptions // 满足当前type的等式选项
        });
      });
    }
  }
};
</script>

<style lang="scss">
@import "../vars.scss";
.richform {
  .layout {
    .verification-dependency {
      .el-dialog__header {
        background: #f1f1f1;
      }
      .el-dialog {
        min-width: 500px;
      }
      .dialog-body {
        display: flex;
        flex-direction: column;
        .addition-condition-container {
          .condition-title {
            height: 50px;
            line-height: 50px;
            font-size: 14px;
            color: #333;
          }
          .condition-item {
            display: grid;
            grid-template-columns: 120px 180px auto 50px;
            grid-template-rows: auto auto auto auto;
            grid-gap: 3px 3px;
            align-items: center;
          }
          .add-condition {
            height: 35px;
            line-height: 35px;
            font-size: 14px;
            color: #1890ff;
            cursor: pointer;
          }
          .delete-condition-item {
            font-size: 30px;
            cursor: pointer;
            display: none;
          }
          .active-delete-item {
            color: #f00;
            display: block;
          }
        }
      }
    }
  }
}
</style>
