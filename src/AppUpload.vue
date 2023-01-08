<template>
  <el-container>
    <el-header>
      <h2>文件分片上传</h2>
    </el-header>
    <el-main>
      <div class="main">
        <div id="radios">
          <div class="radio" v-for="api_option in api_options" :key="api_option.path">
            <el-radio :label="api_option.path" v-model="choose_api">
              <el-tag :type="api_option.api.transit ? 'danger' : 'success'" effect="plain">{{
                api_option.api.name
              }}</el-tag>
            </el-radio>
          </div>
        </div>
        <el-upload drag action="#" :show-file-list="false" :http-request="httpRequest" ref="uploader"
          :auto-upload="true" :disabled="choose_api == '' || uploading" @click="clickUpload">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">粘贴/将文件拖到此处，或<em>点击上传</em></div>
        </el-upload>
        <el-input v-model="jsonInfo" id="jsonInfo" type="textarea" autosize></el-input>
        <!-- <div class="urls" v-for="url in urls">
          <url-show v-show="url.url !== ''" id="url-show" :url="url.url" :name="url.name"></url-show>
        </div> -->
      </div>
    </el-main>
    <div class="footer">
      <el-link href="/download" type="success" target="_blank">免费文件下载</el-link>
    </div>
  </el-container>
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, onMounted, ref } from "vue";
import ImgApi from "./img_api";
import { ElMessage } from "element-plus";
import upload from "./utils/upload_xhr";
import UrlShow from "./components/UrlShow.vue";
import FileInfo from "./file_info";

interface Option {
  path: string;
  api: ImgApi;
}

interface Urls {
  name: string;
  url: string;
}

export default defineComponent({
  name: "App",
  components: {
    UrlShow,
  },
  setup() {
    const uploading = ref(false)
    const apis = import.meta.globEager("./apis/*.ts");
    const api_options = ref<Option[]>([]);
    const choose_api = ref("");
    const url = ref("");
    const urls = ref<Urls[]>([]);
    const name = ref("");
    const jsonInfo = ref("")
    const uploader = ref<any>(null);
    for (const path in apis) {
      const api = apis[path].default as ImgApi;
      api_options.value.push({ path: path, api: api });
    }

    const blobSlice = (blob: any, start: number, length: number) => {
      if (blob.slice) {
        return blob.slice(start, length);
      } else if (blob.webkitSlice) {
        return blob.webkitSlice(start, length);
      } else if (blob.mozSlice) {
        return blob.mozSlice(start, length);
      } else {
        return null;
      }
    }

    const createAndDownloadFile = async (fileName: string, content: any) => {
      console.log(content)
      const blob = new Blob([content], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = fileName;
      a.click();
    }

    function concatenate(arrays: any[]) {
      if (!arrays.length) return new Uint8Array(0);
      let totalLength = arrays.reduce((acc: any, value: string | any[]) => acc + value.length, 0);
      let result = new Uint8Array(totalLength);
      let length = 0;
      for (let array of arrays) {
        result.set(array, length);
        length += array.length;
      }
      return result;
    }


    const httpRequest = (param: any) => {
      const file = param.file;
      const imgApi = apis[choose_api.value].default as ImgApi
      let fileInfo = { name: "", filesize: 0, urls: [], params: { padding: 0 } } as FileInfo
      if (jsonInfo.value && jsonInfo.value !== '') {
        fileInfo = JSON.parse(jsonInfo.value) as FileInfo
        if (fileInfo.name !== file.name || fileInfo.filesize !== file.size) {
          ElMessage.warning("文件信息不符合！开始重新上传...")
          fileInfo = { name: "", filesize: 0, urls: [], params: { padding: 0 } } as FileInfo
        }
      }
      console.log(fileInfo)
      fileInfo.name = file.name
      fileInfo.filesize = file.size
      console.log(imgApi)
      fileInfo.params.padding = imgApi.bits.length
      uploading.value = true;
      const poolLimit = 8;
      let _start = 0;
      const _fileSize = file.size;
      const chunk_size = (imgApi.max_size - imgApi.bits.length)
      if (fileInfo.urls.length == 0) {
        fileInfo.urls = [...new Array<string>(Math.ceil(_fileSize / chunk_size))]
      }
      console.log(chunk_size)
      const ret: any[] = [];
      let count = 0;
      const uploadFile = async (i: number) => {
        let _end = _start + chunk_size
        if ((chunk_size + _start) > _fileSize) {
          _end = _fileSize
        }
        console.log(fileInfo.urls[i])
        if (fileInfo.urls[i] && fileInfo.urls[i].startsWith('http')) {
          _start = _start + _end;
          console.log(_start)
          if (_end == _fileSize) {
            uploading.value =false
            Promise.all(ret)
            ElMessage.success("文件信息补全完毕...");
            jsonInfo.value = JSON.stringify(fileInfo, null, 4);
            return;
          }
          uploadFile(i + 1);
          return;
        }
        let chunk = blobSlice(file, _start, _end)
        const reader = new FileReader();
        reader.readAsArrayBuffer(chunk);
        reader.onload = function () {
          const result: any = this.result;
          if (!result && !(result instanceof ArrayBuffer)) return;
          let contents = concatenate([imgApi.bits, new Uint8Array(result)]);
          const _blob = new Blob([contents], { type: imgApi.file_type });
          console.log(_blob)
          const p = new Promise((resolve, reject) =>
            upload(imgApi, _blob).then((res) => {
              if (!res.img_url || res.err_msg) {
                jsonInfo.value = JSON.stringify(fileInfo, null, 4);
                uploading.value = false;
                ElMessage.error(res.err_msg);
                // param.onError();
                return reject(res.err_msg);
              }
              count = count + 1;
              ElMessage.success("[" + count + "/" + fileInfo.urls.length + "] 分片上传成功...")
              // param.onSuccess();
              fileInfo.urls[i] = res.img_url;
              urls.value.push({ url: res.img_url, name: file.name })
              jsonInfo.value = JSON.stringify(fileInfo, null, 4);
              resolve(0);
            }));
          ret.push(p)
          if (_end != _fileSize) {
            _start = _start + chunk_size
            // if ((i + 1) % poolLimit == 0) Promise.all(ret).then(() => uploadFile(i + 1))
            // else uploadFile(i + 1)
            uploadFile(i + 1)
          }
          else {
            return Promise.all(ret)
              .then(() => {
                ElMessage.success("文件上传完毕...")
                uploading.value = false;
                jsonInfo.value = JSON.stringify(fileInfo, null, 4);
                createAndDownloadFile(fileInfo.name + ".json", jsonInfo.value);
              });
          }
        }
      }
      ElMessage.info("开始上传文件...");
      uploadFile(0)
    };


    const clickUpload = () => {
      if (!choose_api.value) {
        ElMessage.warning("请先选择一个接口");
        return;
      }
      if (uploading.value) {
        ElMessage.warning("正在上传中, 请稍后...");
        return
      }
    };
    const pasteUpload = async (e: any) => {
      if (!choose_api.value) {
        ElMessage.warning("请先选择一个接口");
        return;
      }
      if (uploading.value) {
        ElMessage.warning("正在上传中, 请稍后...");
      }
      const items: any = e.clipboardData!.items;
      const file = items[0].getAsFile();
      return httpRequest({ param: file })
      for (const item of items) {
        if (item.type.indexOf("image") !== -1) {
          const file = item.getAsFile();
          uploading.value = true;
          const res = await upload(
            apis[choose_api.value].default as ImgApi,
            file
          );
          uploading.value = false;
          if (!res.img_url || res.err_msg) {
            ElMessage.error(res.err_msg);
            return;
          }
          url.value = res.img_url;
          name.value = file.name;
          return;
        }
      }
      ElMessage.warning("请粘贴图片文件");
    };

    onMounted(() => {
      document.addEventListener("paste", pasteUpload);
    });
    onBeforeUnmount(() => {
      document.removeEventListener("paste", pasteUpload);
    });
    return {
      api_options,
      choose_api,
      url,
      name,
      httpRequest,
      uploader,
      clickUpload,
      uploading,
      urls,
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


#copyBtn {
  /*display: inline-block;*/
  position: absolute;
  bottom: 5px;
  right: 1px;
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
