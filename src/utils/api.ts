import { getCurrentInstance } from "vue";
const proxy  = getCurrentInstance()

import FileInfo from "../file_info";

export const api = "https://img.smoe.top/api"

interface Data {
  [key: string]: any;
}

export interface Resp {
  code: number;
  message: string;
  data: Data;
}

export const getFileInfo = async (share_id: string): Promise<Resp> => {
  return await postRequest("/get_file_info", { share_id: share_id });
};

export const uploadFileInfo = async (params: FileInfo): Promise<Resp> => {
  return await postRequest("/upload_file_info", params);
}

export const deleteFileInfo =async (params: any) => {
  return await postRequest("/delete/" + params.token, { share_id: params.share_id} );
}

export const postRequest = async (path: string, params: any, headers?: any): Promise<Resp> => {
  let formData = new FormData();
  if (params) {
    Object.keys(params).forEach((key) => {
      if (typeof params[key] == "string") {
        formData.append(key, params[key]);
      } else {
        formData.append(key, JSON.stringify(params[key]));
      }
    })
  }
  return fetch(api + path, {
    method: "POST",
    body: formData,
    headers: headers,
  })
    .then((resp) => resp.json())
    .then((json) => {
      return json as Resp;
    })
    .catch((e) => {
      return { code: -1, message: e, data: {} } as Resp;
    });
}