<!--
  values需要传入image字段才可以渲染出图片，传入uploadImgUrl才可以上传图片
  values= {uploadImgUrl:'',image:''},
  只支持单个图片上传！
  真正的上传在richform的index文件执行
-->

<template>
  <el-upload
    class="avatar-uploader"
    :disabled="field.readOnly"
    :action="this.uploadImgUrl"
    :show-file-list="false"
    :auto-upload="false"
    :on-change="handleAvatarChange"
    drag
  >
    <img
      style="height:180px;width:280px"
      v-if="value&&!error"
      @error="error=true"
      :src="value"
      class="avatar"
    />
    <template v-else>
      <i class="el-icon-upload"></i>
      <div
        class="el-upload__text"
      >{{field.description?field.description:this.$t("richform.drapFileOrClick")}}</div>
    </template>
  </el-upload>
</template>

<script>
import mixin from "./base.mixin";
import { uploadImgUrl, getImgUrl } from "../urls";
import eventbus from "../eventbus";
export default {
  name: "UploadWidget",
  data() {
    return {
      defaultUrl: "",
      error: false
    };
  },
  computed: {
    // 上传的图片url
    uploadImgUrl() {
      return this.values.uploadImgUrl
        ? this.values.uploadImgUrl
        : this.defaultUrl;
    },
    // 显示图片的url
    imageUrl() {
      return this.value ? this.value : "";
    }
  },
  watch: {
    value() {
      this.error = false;
    }
  },
  mounted() {},
  mixins: [mixin],
  methods: {
    // 定义一个规范化Schema的方法，用来为组件添加个性化的默认属性
    defaultSchema() {
      return {};
    },
    toFieldValue(value) {
      return value;
    },
    fromFieldValue(value) {
      return value;
    },
    getFriendValue(value) {
      return value;
    },
    handleAvatarChange(file, fileList) {
      const isJPG = file.raw.type === "image/png";
      const isLt150kb = file.size / 1024 / 1024 < 0.15;
      if (!isJPG) {
        this.$message.error(this.$t("richform.imgTypeOnlyPng"));
      }
      if (!isLt150kb) {
        this.$message.error(this.$t("richform.imgSizeSmaller150kb"));
      }
      if (isJPG && isLt150kb) {
        this.error = false;
        this.value = URL.createObjectURL(file.raw);
        this.values.submitImgFile = file.raw;
      }
    }
  }
};
</script>

<style lang="scss">
.avatar-uploader .el-upload {
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  text-align: center;
}
.el-upload-dragger {
  width: 280px;
  height: 180px;
  display: block;
  background-color: transparent;
}
</style>
