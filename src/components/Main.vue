<template>
  <div class="container">
    <h3>图片显隐控制</h3>
    <el-switch v-model="switchvalue" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
    <span v-if="switchvalue" class="imgContainer">
      <img :src="logoImg" class="logoImg" />
    </span>
    <div class="line"></div>
    <h3>表单请求：</h3>
    <Form ref="form" :form="form" />
  </div>
</template>

<script>
import Form from "./RichForm";
import logoImg from "./../assets/logo.png";

export default {
  data() {
    return {
      switchvalue: true,
      logoImg: logoImg,
      form: {
        // 设备事件消息
        name: "", // 表单英文名称
        url: "",
        size: "small",
        submit: {
          enctype: "",
          feedback: true,
          method: "PATCH",
          mode: "ajax",
          onlyDirty: true,
          query: {},
          url: "/apps/hispro/api/devices/{sn}/attributes"
        }, // 表单提交方式,default:以默认向url地址提交;ajax:以AJAX方式提交表单
        border: false, // 显示边框
        fit: false, // 自动充满容器
        readOnly: true, // 只读状态，不允许提交
        labelSuffix: true, // 字段标题后缀内容，默认' : '
        inline: true, // 字段标题显示位置, 默认true左侧left,false显示在top上方
        advanced: false,
        labelWidth: "90px", // 标签宽度,可选px值
        labelAlign: "right", // 标签对齐, 默认左对齐, 可选右对齐
        labelInline: true,
        compact: true, // 紧凑模式，字段之间的距离更小些,表头更小些等
        method: "post", // 提交方法,get,post
        validator: {
          // 什么时候对字段值进行验证，
          // input-在输入时马上验证，submit-当提交时进行验证,change=改变时
          on: "input",
          flat: false // 对JSON默认按Schema结构进行验证，如果=true则忽略层次结构分别对每个字段进行验证
        },
        enabled: true,
        grid: false,
        history: { enabled: true, key: "", storage: "local" },
        schemaId: "",
        showHelp: false,
        showRequire: true,
        layout: [
          {
            name: "sip.server",
            title: "通讯服务器"
          },
          {
            name: "name",
            title: "设备名称"
          },
          {
            name: "network.eth0.mac",
            title: "MAC地址",
            readOnly: true
          },
          {
            name: "network.eth0.dhcp",
            title: "DHCP"
          },
          {
            name: "network.eth0.ip",
            title: "IP地址",
            enabled: {
              "network.eth0.dhcp": { const: false }
            }
          },
          {
            name: "network.eth0.subnetmask",
            title: "子网掩码",
            enabled: {
              "network.eth0.dhcp": { const: false }
            }
          },
          {
            name: "network.eth0.gateway",
            title: "网关",
            enabled: {
              "network.eth0.dhcp": { const: false }
            }
          },
          {
            name: "network.eth0.dns_prefer",
            title: "首选DNS"
          },
          {
            name: "network.eth0.dns_alter",
            title: "备选DNS"
          },
          {
            name: "enabled",
            title: "启用",
            readOnly: true
          },
          {
            name: "version",
            title: "版本"
          }
        ]
      }
    };
  },
  components: {
    Form
  }
};
</script>

<style lang="scss">
.container {
  padding: 20px;

  .logoImg {
    width: 23px;
    vertical-align: middle;
  }
  .line {
    display: inline-block;
    width: 100%;
    height: 0px;
    border: 1px solid #3b3a3a;
  }
}
</style>
