// ./functions/api/upload_file_info.ts

import { FileInfo, Env, ResponseTemplate } from "./interface";
import { jsonResponse, corsHeaders, shareUrl, deleteUrl } from "./utils";
import config from "./config";
import { save_info, randomString } from "./utils";


export const onRequestPost: PagesFunctin<Env> = async ({ request, env }) => {
  const responseTemplate: ResponseTemplate = {
    code: 0,
    message: "",
    data: {
      filename: "",
      size: 0,
      share_url: "",
      share_id: "",
      delete_url: "",
      token: "",
      timestamp: 0,
    },
  }
  try {
    const fileInfo = { name: "", filesize: 0, urls: "", params: "" as any, timestamp: 0 }
    const formData = await request.formData();
    formData.forEach((value, key) => fileInfo[key] = value);
    if (!fileInfo.name ||
      !fileInfo.filesize ||
      !fileInfo.urls ||
      !fileInfo.params
    ) {
      responseTemplate.code = 2;
      responseTemplate.message = "文件信息有误...";
      responseTemplate.data = {};
      return jsonResponse(responseTemplate, {
        headers: corsHeaders
      });
    }
    fileInfo.timestamp = new Date().getTime();
    fileInfo.params = JSON.parse(fileInfo.params);
    fileInfo.urls = JSON.parse(fileInfo.urls);
    let token = await randomString(12);
    let params = { metadata: { token: token } };
    if (fileInfo.params.expiration_ttl) {
      params = fileInfo.params.expiration_ttl;
    }
    else if (fileInfo.params.expiration) {
      params = fileInfo.params.expiration;
    }
    let stat, random_key = await save_info(fileInfo, env, params);
    if (typeof stat == "undefined") {
      responseTemplate.code = 0;
      responseTemplate.message = "Success";
      responseTemplate.data.share_url = shareUrl(random_key);
      responseTemplate.data.timestamp = fileInfo.timestamp;
      responseTemplate.data.delete_url = deleteUrl(random_key, token);
      responseTemplate.data.token = token;
      responseTemplate.data.share_id = random_key;
      responseTemplate.data.filename = fileInfo.name;
      responseTemplate.data.size = fileInfo.filesize;
      return jsonResponse(responseTemplate, {
        headers: {
          ...corsHeaders,
          "Access-Control-Allow-Headers": request.headers.get("Access-Control-Request-Headers"),
        }
      })
    }
    else {
      responseTemplate.code = 1;
      responseTemplate.message = "Error:Reach the KV write limitation.";
      responseTemplate.data = {};
      return jsonResponse(responseTemplate, {
        headers: {
          ...corsHeaders,
          "Access-Control-Allow-Headers": request.headers.get("Access-Control-Request-Headers"),
        }
      })
    }
  }
  catch (e) {
    responseTemplate.code = 3;
    responseTemplate.message = "意料之外的错误... :" + e;
    responseTemplate.data = {};
    return jsonResponse(responseTemplate, {
      headers: corsHeaders
    })
  }
};