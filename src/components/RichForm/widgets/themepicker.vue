<!-- 
    颜色选择器目前还没有完成，请谨慎使用！！！
 -->

<template>
  <div class="theme-picker">
    <div
      class="presetColor"
      @click="updateSettings({theme:color})"
      :class="{actived:theme==color}"
      :key="color"
      v-for="color of presets"
      :style="{background:color}"
    ></div>
    <el-color-picker
      v-model="theme"
      :predefine="['#409EFF', '#1890ff', '#304156','#212121','#11a983', '#13c2c2', '#6959CD', '#f5222d', ]"
      class="picker"
      popper-class="picker-dropdown"
    />
  </div>
</template>

<script>
import { get, call } from "vuex-pathify";
import mixin from "./base.mixin";

const version = require("element-ui/package.json").version; // element-ui version from node_modules
const ORIGINAL_THEME = "#409EFF"; // default color

export default {
  name: "BbuttonWidget",
  mixins: [mixin],
  props: {
    presets: {
      type: Array,
      default: () => ["#cf1322", "#73d13d", "#40a9ff", "#d48806"]
    }
  },
  data() {
    return {
      chalk: "", // content of theme-chalk css
      theme: ""
    };
  },
  computed: {
    defaultTheme: get("my/theme")
  },
  watch: {
    defaultTheme: {
      handler: function(val, oldVal) {
        this.theme = val;
      },
      immediate: true
    },
    async theme(val) {
      this.value = val;
      const oldVal = this.chalk ? this.theme : ORIGINAL_THEME;
      if (typeof val !== "string") return;
      const themeCluster = this.getThemeCluster(val.replace("#", ""));
      const originalCluster = this.getThemeCluster(oldVal.replace("#", ""));
      //console.log(themeCluster, originalCluster);

      const $message = this.$message({
        message: "  Compiling the theme",
        customClass: "theme-message",
        type: "success",
        duration: 0,
        iconClass: "el-icon-loading"
      });

      const getHandler = (variable, id) => {
        return () => {
          const originalCluster = this.getThemeCluster(
            ORIGINAL_THEME.replace("#", "")
          );
          const newStyle = this.updateStyle(
            this[variable],
            originalCluster,
            themeCluster
          );

          let styleTag = document.getElementById(id);
          if (!styleTag) {
            styleTag = document.createElement("style");
            styleTag.setAttribute("id", id);
            document.head.appendChild(styleTag);
          }
          styleTag.innerText = newStyle;
        };
      };

      if (!this.chalk) {
        const url = `https://unpkg.com/element-ui@${version}/lib/theme-chalk/index.css`;
        await this.getCSSString(url, "chalk");
      }

      const chalkHandler = getHandler("chalk", "chalk-style");

      chalkHandler();

      const styles = [].slice
        .call(document.querySelectorAll("style"))
        .filter(style => {
          const text = style.innerText;
          return (
            new RegExp(oldVal, "i").test(text) && !/Chalk Variables/.test(text)
          );
        });
      styles.forEach(style => {
        const { innerText } = style;
        if (typeof innerText !== "string") return;
        style.innerText = this.updateStyle(
          innerText,
          originalCluster,
          themeCluster
        );
      });

      //this.$emit("change", {theme:val});
      this.updateSettings({ theme: val });
      $message.close();
    }
  },

  methods: {
    updateSettings: call("my/updateProfile"),
    updateStyle(style, oldCluster, newCluster) {
      let newStyle = style;
      oldCluster.forEach((color, index) => {
        newStyle = newStyle.replace(new RegExp(color, "ig"), newCluster[index]);
      });
      return newStyle;
    },

    getCSSString(url, variable) {
      return new Promise(resolve => {
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
          if (xhr.readyState === 4 && xhr.status === 200) {
            this[variable] = xhr.responseText.replace(/@font-face{[^}]+}/, "");
            resolve();
          }
        };
        xhr.open("GET", url);
        xhr.send();
      });
    },

    getThemeCluster(theme) {
      const tintColor = (color, tint) => {
        let red = parseInt(color.slice(0, 2), 16);
        let green = parseInt(color.slice(2, 4), 16);
        let blue = parseInt(color.slice(4, 6), 16);

        if (tint === 0) {
          // when primary color is in its rgb space
          return [red, green, blue].join(",");
        } else {
          red += Math.round(tint * (255 - red));
          green += Math.round(tint * (255 - green));
          blue += Math.round(tint * (255 - blue));

          red = red.toString(16);
          green = green.toString(16);
          blue = blue.toString(16);

          return `#${red}${green}${blue}`;
        }
      };

      const shadeColor = (color, shade) => {
        let red = parseInt(color.slice(0, 2), 16);
        let green = parseInt(color.slice(2, 4), 16);
        let blue = parseInt(color.slice(4, 6), 16);

        red = Math.round((1 - shade) * red);
        green = Math.round((1 - shade) * green);
        blue = Math.round((1 - shade) * blue);

        red = red.toString(16);
        green = green.toString(16);
        blue = blue.toString(16);

        return `#${red}${green}${blue}`;
      };

      const clusters = [theme];
      for (let i = 0; i <= 9; i++) {
        clusters.push(tintColor(theme, Number((i / 10).toFixed(2))));
      }
      clusters.push(shadeColor(theme, 0.1));
      return clusters;
    }
  }
};
</script>

<style lang="scss" scoped>
.theme-picker {
  .theme-message,
  .picker-dropdown {
    z-index: 99999 !important;
  }
  .presetColor {
    display: inline-block;
    width: 20px;
    height: 20px;
    border-radius: 3px;
    margin-right: 4px;
    box-sizing: border-box;
    cursor: pointer;
    &:hover {
      border: 2px solid #cfbbbb;
    }
    &.actived {
      border: 2px solid #cfbbbb;
    }
  }
}
</style>
<style>
.theme-picker .el-color-picker__trigger {
  height: 26px !important;
  width: 26px !important;
  padding: 2px;
}
.picker-dropdown .el-color-dropdown__link-btn {
  display: none;
}
</style>
