<template>
  <el-container>
    <el-header>
      <h2>使用Json文件下载</h2>
    </el-header>
    <el-main>
      <div class="main">
        <el-upload drag accept=".json" action="#" :show-file-list="false" :http-request="httpRequest" ref="downloader"
          :disabled="downloading" :auto-upload="true">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">粘贴/将文件拖到此处，或<em>点击上传</em></div>
        </el-upload>
        <el-input v-model="jsonInfo" id="jsonInfo" type="textarea" autosize></el-input>
      </div>
    </el-main>
    <div class="footer">
      <el-link href="/upload" type="success" target="_blank">免费文件上传</el-link>
    </div>
  </el-container>
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, onMounted, ref } from "@vue/runtime-core";
import { createDownloadStream } from "./utils/common";

import { ElMessage } from "element-plus";
import UrlShow from "./components/UrlShow.vue";
import FileInfo from "./file_info";
import NProgress from 'nprogress'

export default defineComponent({
  name: "App",
  components: {
    UrlShow,
  },
  setup() {
    const downloading = ref(false)
    const controller = new AbortController();
    const { signal } = controller;
    const apis = import.meta.globEager("./apis/*.ts");
    const name = ref("");
    const downloader = ref<any>(null);
    let completions = 0;
    let jsonData: FileInfo;
    const jsonInfo = ref("");

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
            ElMessage.success("[" + completions + "/" + jsonData.urls.length + "] 分片下载成功...")
            return writable.close()
          }
          let p = await writable.write(value)
          ret.push(p)
          pump();
        };
        pump();
      })
    }


    const poolDownload = async (file: any) => {
      let reader = new FileReader();
      reader.readAsText(file);
      reader.onload = async (e) => {
        completions = 0;
        downloading.value = true;
        NProgress.start();
        jsonInfo.value = e.target!.result as string;
        jsonData = JSON.parse(e.target!.result as string);
        console.log(jsonData)
        // const reader = file.stream().getReader();
        const writableStream = await createDownloadStream(jsonData.name, jsonData.filesize);
        const writable = writableStream.getWriter();
        const reads: ReadableStreamDefaultReader<any>[] = [];
        const readStream = async (i: number) => {
          if (!downloading.value) { NProgress.done(); controller.abort(); ElMessage.error("下载失败..."); return writable.close(); }
          if (i == jsonData.urls.length) { console.log("读取完成"); NProgress.done(); downloading.value = false; ElMessage.success("下载完成..."); return writable.close(); }
          const { done, value } = await reads[i].read();
          if (done) {
            readStream(i + 1); return;
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
          await download_chunk(url, transfromStream.writable.getWriter()).catch((err) => {
            downloading.value = false;
            NProgress.done();
            controller.abort();
            console.error("发生了一些错误：" + err);
          });
        })
        readStream(0);
        ElMessage.success("上传成功，开始下载...")
      };
    };

    const httpRequest = async (param: any) => {
      console.log(param)
      const file = param.file;
      await poolDownload(file);
    }

    const pasteUpload = async (e: any) => {
      const items: any = e.clipboardData!.items;
      const file = items.item(0)!;
      await poolDownload(file);
    }

    onMounted(() => {
      document.addEventListener("paste", pasteUpload);
    });
    onBeforeUnmount(() => {
      document.removeEventListener("paste", pasteUpload);
    });

    const singleDownload = async (writable: WritableStreamDefaultWriter<any>) => {
      const poolLimit = 4;
      const ret: ReadableStreamDefaultReader<any>[] = [];
      const createDownloadTask = async (_i: number) => {
        for (let i = 0 + _i; i < poolLimit + _i; i++) {
          if (i == jsonData.urls.length) break;
          const transfromStream = new TransformStream()
          ret.push(transfromStream.readable.getReader())
          await download_chunk(jsonData.urls[i], transfromStream.writable.getWriter())
        }
      }
      const readStream = async (i: number) => {
        if (i == jsonData.urls.length) return writable.close()
        const { done, value } = await ret[i].read();
        if (done) {
          if ((i + poolLimit - 1) % poolLimit == 0) return await createDownloadTask(i + poolLimit - 1);
          readStream(i + 1);
        }
        await writable.write(value).then(() => readStream(i))
      }
      await createDownloadTask(0).then(() => readStream(0));
    };
    return {
      name,
      httpRequest,
      downloader,
      downloading,
      poolDownload,
      jsonInfo,
    };
  },
});
</script>

<style>
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

.el-tabs {
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}

.el-tag {
  min-width: 74px;
}
</style>
