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
      <el-link href="/upload" type="success" target="_blank">免费文件上传</el-link>
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
  name: "Share",
  components: {
    UrlShow,
  },
  setup() {
    const uploading = ref(false)
    const attachmentUrl = ref("")
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

    const download = async () => {

    }
    
    return {
      api_options,
      choose_api,
      url,
      name,
      uploader,
      uploading,
      attachmentUrl,
      download,
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
