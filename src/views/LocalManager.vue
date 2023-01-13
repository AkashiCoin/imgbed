<template>
  <div>
    <el-table :data="jsonInfo">
      <el-table-column
        align="center"
        label="No"
        type="index"
        width="60"
      ></el-table-column>
      <el-table-column prop="name" label="文件名"></el-table-column>
      <el-table-column
        prop="filesize"
        :formatter="sizeFormat"
        label="文件大小"
        width="100px"
      ></el-table-column>
      <!-- <el-table-column prop="params" label="参数">
        <template #default="scope">
          <el-tag
            effect="plain"
            v-for="item in scope.params"
            :key="item"
            :data="item"
            type="success"
            >{{ item }}</el-tag
          >
        </template></el-table-column
      > -->
      <el-table-column label="操作">
        <template #default="scope">
          <el-button
            class="el-button"
            size="small"
            type="success"
            @click="showInfo(scope.row)"
            >信息
            <i class="el-icon-info el-icon--right"></i>
          </el-button>
          <el-button
            class="el-button"
            size="small"
            type="primary"
            @click="Download(scope.row)"
            >下载
            <i class="el-icon-download el-icon--right"></i>
          </el-button>
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
    <file-show v-model:visible="visible_flag" :data="show_info"></file-show>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "@vue/runtime-core";
import { useRouter, useRoute } from "vue-router";
import FileShow from "../components/FileShow.vue";

import { ElMessage, ElMessageBox } from "element-plus";
import FileInfo from "../file_info";
import { isArray } from "@vue/shared";
import { deleteFileInfo, getFileInfo } from "../utils/api";
import { DateUtil, formatSize } from "../utils/util";
import poolDownload from "../utils/download";
import { FileData, file_data, metadata } from "../store";

import Footer from "../components/Footer.vue";

export default defineComponent({
  name: "local_manager",
  components: {
    Footer,
    FileShow,
  },
  setup() {
    const downloading = ref(false);
    const show_info = ref<FileData>();
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
    const visible_flag = ref(false);

    jsonInfo.value = file_data.get();
    shareInfo.value = metadata.get();

    const Delete = async (info: any) => {
      ElMessageBox.confirm("是否确定删除？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          // console.log(info)
          info = JSON.parse(JSON.stringify(info));
          console.log(info);
          let f = file_data.delete(info);
          if (f) {
            ElMessage.success("删除成功");
          } else {
            ElMessage.error("删除失败");
          }
          jsonInfo.value = file_data.get();
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

    const showInfo = (info: any) => {
      info = JSON.parse(JSON.stringify(info));
      show_info.value = file_data.get(info);
      console.log(show_info.value);
      visible_flag.value = true;
    };

    watch(
      () => visible_flag.value,
      (val) => {
        console.log("监听flag值得变化:", val);
        jsonInfo.value = file_data.get();
      }
    );

    const Download = async (info: any) => {
      downloading.value = true;
      const file_info: FileInfo = JSON.parse(JSON.stringify(info));
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
      shareInfo,
      Download,
      Delete,
      dataFormat,
      sizeFormat,
      showInfo,
      visible_flag,
      show_info,
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
