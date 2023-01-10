import ImgApi from "../img_api";
import NProgress from 'nprogress'
import { transit_api, Resp, handleRes, generateFormData } from './upload_util'
import FileInfo from "../file_info";
import { ElMessage } from "element-plus";


export const preCheck = (file_info: FileInfo) => {
  if (
    !file_info.name ||
    !file_info.filesize ||
    !file_info.urls ||
    !file_info.params
  ) {
    return false;
  }
  return true;
};

export const cancelReaders = async (reads: ReadableStreamDefaultReader<any>[]) => {
  reads.forEach(async (reader) => {
    await reader.cancel();
  });
};