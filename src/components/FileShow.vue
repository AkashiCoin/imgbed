<template>
  <div class="file-show">
    <el-dialog
      title="文件信息"
      v-model="dialogVisble"
      width="30%"
      :before-close="close"
    >
      <el-form label-width="auto" label-position="right">
        <el-form-item label="文件名:">
          <el-input v-model="data.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="文件大小:">
          <div>{{ formatted_size }}</div>
        </el-form-item>
        <el-form-item label="参数:">
          <el-input :v-model="JSON.stringify(data.params)" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="close">取 消</el-button>
          <el-button type="primary" @click="confirm">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { ref, watch, defineComponent } from "vue";
import { formatSize } from "../utils/util";
import FileInfo from "../file_info";

export default defineComponent({
  name: "file_show",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    data: {
      default: {
        name: "",
        filesize: 0,
        urls: [],
        params: { padding: 0 },
        timestamp: 0,
      } as FileInfo,
    },
  },

  setup(props, ctx) {
    const dialogVisble = ref(false);
    const _data = ref(props.data);
    const formatted_size = ref(formatSize(props.data.filesize));

    const close = () => {
      ctx.emit("update:visible", false);
    };

    const confirm = () => {
      console.log("你点击了确定按钮");
      ctx.emit("update:visible", false);
    };

    watch(props, () => {
      dialogVisble.value = props.visible;
      _data.value = props.data;
      formatted_size.value = formatSize(props.data.filesize);
    });

    return {
      dialogVisble,
      confirm,
      close,
      data: _data,
      formatted_size,
    };
  },
});
</script>
<style scoped>
</style>
