<template>
  <el-container>
    <el-header>
      <h2>使用Json文件下载</h2>
    </el-header>
    <el-main>
      <div class="main">
        <el-upload
          drag
          accept=".json"
          action="#"
          :show-file-list="false"
          :http-request="loadFile"
          ref="downloader"
          :disabled="downloading"
          :auto-upload="true"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">
            粘贴/将文件拖到此处，或<em>点击上传</em>
          </div>
        </el-upload>
        <el-button
          id="download"
          class="el-button"
          type="primary"
          size="small"
          @click="Download"
          >下载<i class="el-icon-download el-icon--right"></i
        ></el-button>
        <el-input
          class="el-input"
          v-model="jsonInfo"
          id="jsonInfo"
          type="textarea"
          autosize
          placeholder="文件分片信息"
        ></el-input>
      </div>
    </el-main>
    <div class="footer">
      <el-link type="success">
        <router-link to="/upload" style="color: #409eff; text-decoration: none"
          >前往自定义上传
        </router-link>
      </el-link>
    </div>
  </el-container>
</template>

<script lang="ts">
import {
  defineComponent,
  onBeforeUnmount,
  onMounted,
  ref,
} from "@vue/runtime-core";

import { ElMessage } from "element-plus";
import UrlShow from "../components/UrlShow.vue";
import FileInfo from "../file_info";
import poolDownload from "../utils/download";
import { preCheck } from "../utils/download_utils";

export default defineComponent({
  name: "Down",
  components: {
    UrlShow,
  },
  setup() {
    const downloading = ref(false);
    const downloader = ref<any>(null);
    const jsonInfo = ref("");

    const Download = async () => {
      if (jsonInfo.value == "") {
        ElMessage.error("请先上传文件或者输入信息..");
        return false;
      }
      downloading.value = true;
      const file_info: FileInfo = JSON.parse(jsonInfo.value) as FileInfo;
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

    const loadFile = async (param: any) => {
      const file = param.file;
      let reader = new FileReader();
      reader.readAsText(file);
      reader.onload = async (e) => {
        jsonInfo.value = JSON.stringify(
          JSON.parse(e.target!.result as string),
          null,
          4
        );
        if (!preCheck(JSON.parse(jsonInfo.value))) return;
        ElMessage.success("上传成功，点击下载按钮开始下载...");
      };
    };

    const pasteUpload = async (e: any) => {
      const items: any = e.clipboardData!.items;
      const file = items.item(0)!;
      await loadFile({ file });
    };

    onMounted(() => {
      document.addEventListener("paste", pasteUpload);
    });
    onBeforeUnmount(() => {
      document.removeEventListener("paste", pasteUpload);
    });

    // const singleDownload = async (
    //   writable: WritableStreamDefaultWriter<any>
    // ) => {
    //   const poolLimit = 4;
    //   const ret: ReadableStreamDefaultReader<any>[] = [];
    //   const createDownloadTask = async (_i: number) => {
    //     for (let i = 0 + _i; i < poolLimit + _i; i++) {
    //       if (i == jsonData.urls.length) break;
    //       const transfromStream = new TransformStream();
    //       ret.push(transfromStream.readable.getReader());
    //       await download_chunk(
    //         jsonData.urls[i],
    //         transfromStream.writable.getWriter()
    //       );
    //     }
    //   };
    //   const readStream = async (i: number) => {
    //     if (i == jsonData.urls.length) return writable.close();
    //     const { done, value } = await ret[i].read();
    //     if (done) {
    //       if ((i + poolLimit - 1) % poolLimit == 0)
    //         return await createDownloadTask(i + poolLimit - 1);
    //       readStream(i + 1);
    //       return;
    //     }
    //     await writable.write(value).then(() => readStream(i));
    //   };
    //   await createDownloadTask(0).then(() => readStream(0));
    // };

    return {
      loadFile,
      downloader,
      downloading,
      jsonInfo,
      Download,
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

.main {
  width: min(844px, 88vw);
  padding: 15px;
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.95);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}

#radios {
  --mx: 2vw;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 5px;
  justify-items: start;
}

.el-upload {
  margin: 10px 0;
}

.el-upload-dragger {
  width: min(80vw, 360px) !important;
}

.el-input {
  margin: 3px 0;
}

.el-tabs {
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}

.el-tag {
  min-width: 74px;
}
</style>
