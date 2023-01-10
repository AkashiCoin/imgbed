<template>
  <el-container>
    <el-header>
      <h2>文件下载</h2>
    </el-header>
    <el-main>
      <div class="main">
        <el-form>
          <el-form-item label="文件名称:">
            <el-input
              v-model="jsonInfo.name"
              disabled
              placeholder="文件名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="文件大小:">
            <el-input
              v-model="formatted_size"
              disabled
              placeholder="文件大小"
            ></el-input>
          </el-form-item>
          <el-form-item label="分享时间:">
            <el-input
              v-model="formatted_time"
              disabled
              placeholder="文件大小"
            ></el-input>
          </el-form-item>
          <el-form-item label="SHA512:">
            <el-input
              v-model="formatted_time"
              disabled
              placeholder="SHA512"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button
          class="el-button"
          size="small"
          type="primary"
          @click="Download()"
          >下载
          <i class="el-icon-download el-icon--right"></i>
        </el-button>
      </div>
    </el-main>
    <div class="footer">
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
        <router-link
          to="/download"
          style="color: #409eff; text-decoration: none"
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
    </div>
  </el-container>
</template>

<script lang="ts">
import { defineComponent, ref } from "@vue/runtime-core";
import { useRouter, useRoute } from "vue-router";

import { ElMessage } from "element-plus";
import UrlShow from "../components/UrlShow.vue";
import FileInfo from "../file_info";
import { isArray } from "@vue/shared";
import { getFileInfo } from "../utils/api";
import poolDownload from "../utils/download";
import { file_data } from "../store";
import { formatSize } from "../utils/util";

export default defineComponent({
  name: "Share",
  components: {
    UrlShow,
  },
  setup() {
    const downloading = ref(false);
    const jsonInfo = ref<any>({
      file_info: {},
      share_id: "",
      share_url: "",
      timestamp: 0,
    }
    );
    const formatted_size = ref("")
    const formatted_time = ref("")
    let jsonData: FileInfo;
    let shareId: any;
    const route = useRoute();

    console.log(route.params.shareid);
    if (isArray(route.params.shareid)) {
      shareId = route.params.shareid[0];
    } else {
      shareId = route.params.shareid;
    }

    getFileInfo(shareId)
      .then((json) => {
        if (json.code == 0) {
          jsonData = json.data.file_info;
          jsonInfo.value = json.data;
          formatted_size.value = formatSize(jsonData.filesize);
          formatted_time.value = formatSize(jsonInfo.value.timestamp);
          file_data.save(json.data.file_info, { ...json.data });
          console.log(jsonData);
        } else if (json.code == 1) {
          ElMessage.error(json.message);
        } else {
          ElMessage.error(
            "服务器错误, 错误代码: " + json.code + "\n错误信息" + json.message
          );
        }
      })
      .catch((err) => {
        ElMessage.error("意料之外的错误... :" + err);
      });

    const Download = async () => {
      downloading.value = true;
      const file_info: FileInfo = jsonInfo.value;
      ElMessage.success("开始下载...");
      await poolDownload(file_info).then((resp) => {
        console.log(resp);
        downloading.value = false;
        switch (resp.code) {
          case 0:
            ElMessage.success(resp.message);
            break;
          case 1:
            ElMessage.info(resp.message);
            break;
          case 2:
            ElMessage.error(resp.message);
            break;
          case 3:
            ElMessage.warning(resp.message);
            break;
          default:
            ElMessage.error("未知错误: " + resp.message);
        }
      });
    };

    return {
      jsonInfo,
      Download,
      formatted_size,
      formatted_time
    };
  },
});
</script>

<style scoped>
@media screen and (max-width: 600px) {
  .el-message {
    min-width: 80% !important;
  }
}

.el-main {
  display: flex !important;
  flex-direction: column;
  align-items: center;
  padding: 0 !important;
  min-height: calc(95vh - 60px);
}

.el-input {
  margin: 3px 0;
}

.main {
  width: min(844px, 88vw);
  padding: 15px;
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.95);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}
</style>
