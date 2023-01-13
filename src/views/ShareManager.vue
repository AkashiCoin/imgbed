<template>
  <div>
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
        width="120px"
      ></el-table-column>
      <el-table-column
        prop="timestamp"
        :formatter="dataFormat"
        label="分享时间"
        width="120px"
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
      <el-table-column label="操作" width="100px">
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
</template>

<script lang="ts">
import { defineComponent, ref } from "@vue/runtime-core";
import { useRouter, useRoute } from "vue-router";

import { ElMessage, ElMessageBox } from "element-plus";
import UrlShow from "../components/UrlShow.vue";
import FileInfo from "../file_info";
import { isArray } from "@vue/shared";
import { deleteFileInfo, getFileInfo } from "../utils/api";
import { DateUtil, formatSize } from "../utils/util";
import poolDownload from "../utils/download";
import { copyToClip } from "../utils/copy_clip";
import { file_data, metadata } from "../store";

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

    shareInfo.value = metadata.get();

    const Delete = async (info: any) => {
      ElMessageBox.confirm(
        "此操作将删除分享链接，但本地信息依旧会存在, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(async () => {
          info = JSON.parse(JSON.stringify(info));
          console.log(info);
          await deleteFileInfo(info).then((resp) => {
            console.log(resp);
            switch (resp.code) {
              case 0: {
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
                return;
              default:
                ElMessage.error("未知错误: " + resp.message);
                return;
            }
            let v = metadata.delete(info);
            shareInfo.value = metadata.get();
            console.log(v);
          });
        })
        .catch(() => {
          ElMessage.info("已取消删除");
        });
    };

    const dataFormat = (row: any, column: any) => {
      const date = row[column.property];
      if (date === undefined) {
        return "";
      }
      // moment(date).format('YYYY-MM-DD HH:mm:ss')
      return DateUtil.formatDate(date);
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
            file_data.save(file_info);
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

.el-input {
  margin: 3px 0;
}
</style>
