// ./functions/api/upload_file_info.ts

import { FileInfo, Env, ResponseTemplate} from "./interface";
import { jsonResponse, corsHeaders } from "./utils";
import config from "./config";
import { save_info } from "./utils";


export const onRequestPost: PagesFunctin<Env> = async ({ request, env }) => {
  const responseTemplate: ResponseTemplate = {
    code: 0,
    message: "",
    data: {
      shareLink: "",
    },
  }
  try {
    const fileInfo: FileInfo = { name: "", filesize: 0, urls: [], params: {}, timestamp: 0 }
    const formData = await request.formData();
    formData.forEach((value, key) => fileInfo[key] = JSON.parse(value));
    if (!fileInfo.name ||
      !fileInfo.filesize ||
      !fileInfo.urls ||
      !fileInfo.params
    ) {
      responseTemplate.code = 2;
      responseTemplate.message = "文件信息有误..."
      return jsonResponse(responseTemplate, {
        headers: corsHeaders
      });
    }
    fileInfo.timestamp = new Date().getTime();
    let stat, random_key = await save_info(fileInfo, env);
    if (typeof stat == "undefined") {
      responseTemplate.code = 0;
      responseTemplate.message = "Success";
      responseTemplate.data.shareLink = config.domain + random_key;
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
    return jsonResponse(responseTemplate, {
      headers: corsHeaders
    })
  }
};