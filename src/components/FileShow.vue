<template>
  <div class="file-show">
    <el-dialog
      title="文件信息"
      v-model="dialogVisble"
      width="40%"
      :before-close="close"
    >
      <el-form label-width="auto" label-position="right">
        <el-form-item label="文件名:">
          <el-input v-model="data.file_info.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="文件大小:">
          <el-input
            v-model="formatted_size"
            autocomplete="off"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="参数:">
          <el-input
            :v-model="JSON.stringify(data.file_info.params)"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="分享链接:">
          <el-input v-model="data.share_url" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="SHA512:">
          <el-input
            v-model="data.sha512"
            autocomplete="off"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="分享时间:">
          <el-input
            v-model="formatted_time"
            autocomplete="off"
            disabled
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="shareUpload(data.file_info)">分 享</el-button>
          <el-button @click="close">取 消</el-button>
          <el-button type="primary" @click="confirm">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { ref, watch, defineComponent } from "vue";
import { formatSize, DateUtil } from "../utils/util";
import FileInfo from "../file_info";
import { uploadFileInfo } from "../utils/api";
import { ElMessage } from "element-plus";
import { file_data, metadata } from "../store";

export default defineComponent({
  name: "file_show",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    data: {
      default: {
        file_info: {
          name: "",
          filesize: 0,
          urls: [],
          params: { padding: 0 },
          timestamp: 0,
        } as FileInfo,
        sha512: "",
        share_id: "",
        share_url: "",
        timestamp: 0,
      },
    },
  },

  setup(props, ctx) {
    const dialogVisble = ref(false);
    const _data = ref(props.data);
    const formatted_size = ref(formatSize(props.data.file_info.filesize));
    const formatted_time = ref(
      DateUtil.formatDate(props.data.file_info.filesize)
    );

    const close = () => {
      ctx.emit("update:visible", false);
    };

    const confirm = () => {
      console.log("你点击了确定按钮");
      ctx.emit("update:visible", false);
    };

    const shareUpload = async (info: any) => {
      await uploadFileInfo(info)
        .then((json) => {
          if (json.code == 0) {
            ElMessage.success("文件分享成功...");
            metadata.save(json.data);
            file_data.save(info, {
              share_url: json.data.share_url,
              share_id: json.data.share_id,
              timestamp: json.data.timestamp,
              sha512: json.data.sha512,
            });
            ctx.emit("update:visible", false);
            // copyToClip(shareLink.value);
          } else {
            ElMessage.error(
              "文件分享失败，错误代码:" +
                json.code +
                "\n错误信息:" +
                json.message
            );
          }
        })
        .catch((err) => {
          ElMessage.error("文件分享失败，未知错误:" + err);
        });
    };

    watch(props, () => {
      dialogVisble.value = props.visible;
      _data.value = props.data;
      formatted_time.value = DateUtil.formatDate(props.data.timestamp);
      formatted_size.value = formatSize(props.data.file_info.filesize);
    });

    return {
      dialogVisble,
      confirm,
      close,
      data: _data,
      formatted_size,
      formatted_time,
      shareUpload,
    };
  },
});
</script>
<style scoped></style>
