<template>
  <el-container>
    <el-header>
      <h2>文件下载</h2>
    </el-header>
    <el-main>
      <div class="main">
        <el-form-item prop="attachmentUrl" label="附件">
          <el-input v-model="jsonInfo.name" disabled placeholder="文件名称"></el-input>
          <el-input v-model="jsonInfo.filesize" disabled placeholder="文件大小"></el-input>
          <el-button class="el-button" size="mini" type="primary" @click="poolDownload()">下载
            <i class="el-icon-download el-icon--right"></i>
          </el-button>
        </el-form-item>
      </div>
    </el-main>
    <div class="footer">
      <el-link href="/upload" type="success" target="_blank">免费文件上传</el-link>
    </div>
  </el-container>
</template>

<script lang="ts">
import { defineComponent, ref } from "@vue/runtime-core";
import { createDownloadStream } from "./utils/common";
import { useRouter, useRoute } from 'vue-router'

import { ElMessage } from "element-plus";
import UrlShow from "./components/UrlShow.vue";
import FileInfo from "./file_info";
import NProgress from 'nprogress'
import { isArray } from "@vue/shared";
export default defineComponent({
  name: "Share",
  components: {
    UrlShow,
  },
  setup() {
    const attachmentUrl = ref("")
    const downloading = ref(false)
    const jsonInfo = ref<FileInfo>({ name: "", filesize: 0, urls: [], params: { padding: 0 } } as FileInfo);
    let completions = 0;
    let jsonData: FileInfo;
    let controller = new AbortController();
    let { signal } = controller;
    let shareId;
    const route = useRoute()
    const api = "https://img-test.pages.dev/api"


    let formData = new FormData();
    console.log(route.params.shareid)
    if (isArray(route.params.shareid)) {
      shareId = route.params.shareid[0]
    }
    else {
      shareId = route.params.shareid
    }

    formData.set("shareId", shareId)
    fetch(api + "/get_file_info", {
      method: "POST",
      body: formData
    })
    .then((resp) => resp.json())
    .then((json) => {
      if (json.code == 0) {
        jsonData = json.fileInfo;
        jsonInfo.value = json.fileInfo;
        console.log(jsonData)
      }
      else if (json.code == 1) {
        ElMessage.error(json.message)
      }
      else {
        ElMessage.error(json.code + ": "+ json.message);
      }
    })
    .catch((err) => {
      ElMessage.error("意料之外的错误... :" + err);
    })
    async function download_chunk(url: string, writable: WritableStreamDefaultWriter<any>) {
      return fetch(url, {
        headers: {
          "range": `bytes=${jsonData.params.padding}-`,
        },
        signal: signal
      }).then(async (res) => {
        const reader = res.body!.getReader();
        let ret: any[] = [];
        const pump = async () => {
          if (!downloading.value) { return writable.close() };
          const { done, value } = await reader.read();
          if (done) {
            Promise.all(ret)
            completions = completions + 1;
            NProgress.set(completions / jsonData.urls.length);
            // ElMessage.success("[" + completions + "/" + jsonData.urls.length + "] 分片下载成功...")
            return writable.close()
          }
          let p = await writable.write(value)
          ret.push(p)
          pump();
        };
        pump();
      })
    }

    const preCheck = () => {
      if (!jsonData.name ||
        !jsonData.filesize ||
        !jsonData.urls ||
        !jsonData.params
      ) {
        ElMessage.error("文件信息有误...");
        return false;
      }
      return true;
    }

    const poolDownload = async () => {
      if (!preCheck()) return;
      controller = new AbortController();
      signal = controller.signal;
      completions = 0;
      downloading.value = true;
      NProgress.start();
      // const reader = file.stream().getReader();
      const writableStream = await createDownloadStream(jsonData.name, jsonData.filesize);
      const writable = writableStream.getWriter();
      const reads: ReadableStreamDefaultReader<any>[] = [];
      const readStream = async (i: number) => {
        if (!downloading.value) {
          NProgress.done();
          controller.abort();
          ElMessage.error("下载失败...");
          return writable.close();
        }
        if (i == jsonData.urls.length) {
          console.log("读取完成");
          NProgress.done();
          downloading.value = false;
          ElMessage.success("下载完成...");
          return writable.close();
        }
        const { done, value } = await reads[i].read();
        if (done) {
          readStream(i + 1);
          return;
        }
        try {
          await writable.write(value).then(() => readStream(i))
        }
        catch {
          NProgress.done();
          downloading.value = false;
          controller.abort();
        }
      }
      jsonData.urls.forEach(async (url) => {
        let transfromStream = new TransformStream();
        reads.push(transfromStream.readable.getReader());
        await download_chunk(url, transfromStream.writable.getWriter())
          .catch((err) => {
            downloading.value = false;
            NProgress.done();
            controller.abort();
            writable.close();
            console.error("发生了一些错误：" + err);
          });
      })
      readStream(0);
    }

    return {
      jsonInfo,
      attachmentUrl,
      poolDownload,
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
</style>
