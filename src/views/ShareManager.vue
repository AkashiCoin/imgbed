<template>
  <el-container>
    <el-header>
      <h2>管理已分享的文件</h2>
    </el-header>
    <el-main>
      <div class="main">
        <el-table :data="shareInfo">
          <el-table-column
            align="center"
            label="No"
            type="index"
            width="60"
          ></el-table-column>
          <el-table-column prop="filename" label="文件名"></el-table-column>
          <el-table-column
            prop="size"
            :formatter="sizeFormat"
            label="文件大小"
          ></el-table-column>
          <el-table-column
            prop="timestamp"
            :formatter="dataFormat"
            label="分享时间"
          ></el-table-column>
          <el-table-column prop="share_url" label="分享链接">
            <template #default="scope">
              <el-label
                >{{ scope.row.share_url
                }}<i
                  style="cursor: pointer"
                  class="el-input__icon el-icon-copy-document"
                  @click="copyToClip(scope.row.share_url)"
                ></i
              ></el-label>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template #default="scope">
              <!-- <el-button
                class="el-button"
                size="small"
                type="primary"
                @click="Download(scope.row)"
                >下载
                <i class="el-icon-download el-icon--right"></i>
              </el-button> -->
              <el-button
                class="el-button"
                size="small"
                type="danger"
                @click="Delete(scope.row)"
                >删除
                <i class="el-icon-delete el-icon--right"></i>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
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
import { deleteFileInfo, getFileInfo } from "../utils/api";
import { DateUtil, formatSize } from "../utils/util";
import poolDownload from "../utils/download";
import { copyToClip } from "../utils/copy_clip";
import {
  deleteMetadata,
  getFileData,
  getMetadata,
  saveFileData,
} from "../store";

export default defineComponent({
  name: "share_manager",
  components: {
    UrlShow,
  },
  setup() {
    const attachmentUrl = ref("");
    const downloading = ref(false);
    const jsonInfo = ref<FileInfo[]>([
      {
        name: "",
        filesize: 0,
        urls: [],
        params: { padding: 0 },
        timestamp: 0,
      } as FileInfo,
    ]);
    const shareInfo = ref<[]>([]);
    let jsonData: FileInfo;
    let shareId;

    jsonInfo.value = getFileData();
    shareInfo.value = getMetadata();

    const Delete = async (info: any) => {
      ElMessage.success("开始删除...");
      info = JSON.parse(JSON.stringify(info));
      console.log(info);
      await deleteFileInfo(info).then((resp) => {
        console.log(resp);
        switch (resp.code) {
          case 0: {
            let v = deleteMetadata(info);
            console.log(v);
            ElMessage.success(resp.message);
            break;
          }
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

    const dataFormat = (row: any, column: any) => {
      const date = row[column.property];
      if (date === undefined) {
        return "";
      }
      // moment(date).format('YYYY-MM-DD HH:mm:ss')
      return new DateUtil().formatDate(date);
    };

    const sizeFormat = (row: any, column: any) => {
      return formatSize(row[column.property]);
    };

    const Download = async (info: any) => {
      downloading.value = true;
      getFileInfo(info.share_id)
        .then(async (json) => {
          if (json.code == 0) {
            const file_info: FileInfo = json.data.file_info;
            saveFileData(file_info);
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
    };

    return {
      jsonInfo,
      shareInfo,
      attachmentUrl,
      Download,
      Delete,
      dataFormat,
      sizeFormat,
      copyToClip,
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
