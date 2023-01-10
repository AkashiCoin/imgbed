<template>
  <el-link type="success">
    <RouterLink to="/" style="color: #409eff; text-decoration: none"
      >首页
    </RouterLink>
  </el-link>
  |
  <el-link type="success">
    <RouterLink to="/upload" style="color: #409eff; text-decoration: none"
      >前往自定义上传
    </RouterLink>
  </el-link>
  |
  <el-link type="success">
    <router-link to="/download" style="color: #409eff; text-decoration: none"
      >前往自定义下载
    </router-link>
  </el-link>
  |
  <el-link type="success">
    <router-link
      to="/manager/share"
      style="color: #409eff; text-decoration: none"
      >管理分享
    </router-link>
  </el-link>
  |
  <el-link type="success">
    <router-link
      to="/manager/local"
      style="color: #409eff; text-decoration: none"
      >本地管理
    </router-link>
  </el-link>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "custom-footer",
  setup() {},
});
</script>
