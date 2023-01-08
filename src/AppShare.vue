<template>
  <el-container>
    <el-header>
      <h2>文件下载</h2>
    </el-header>
    <el-main>
      <div class="main">
        <el-form-item prop="attachmentUrl" label="附件">
          <el-input v-model="attachmentUrl" disabled></el-input>
          <el-button size="mini" type="primary" @click="download()">下载
          </el-button>
        </el-form-item>
      </div>
    </el-main>
    <div class="footer">
      <el-link href="https://github.com/Xhofe" type="success" target="_blank">Github</el-link>
    </div>
  </el-container>
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, onMounted, ref } from "vue";
import ImgApi from "./img_api";
import { ElMessage } from "element-plus";
import upload from "./utils/upload_fetch";
import UrlShow from "./components/UrlShow.vue";

interface Option {
  path: string;
  api: ImgApi;
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
    const name = ref("");
    const uploader = ref<any>(null);
    for (const path in apis) {
      const api = apis[path].default as ImgApi;
      api_options.value.push({ path: path, api: api });
    }
    const httpRequest = (param: any) => {
      const file = param.file;
      uploading.value = true;
      upload(apis[choose_api.value].default as ImgApi, file).then((res) => {
        uploading.value = false;
        if (!res.img_url || res.err_msg) {
          ElMessage.error(res.err_msg);
          param.onError();
          return;
        }
        param.onSuccess();
        url.value = res.img_url;
        name.value = file.name;
      });
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
