// ./functions/api/get_file_info.ts

import { FileInfo, Env, ResponseTemplate} from "./interface";
import { jsonResponse, corsHeaders, is_key_exist, is_metadata_exist, shareUrl } from "./utils";
import config from "./config";

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const responseTemplate: ResponseTemplate = {
    code: 0,
    message: "",
    data: {
      file_info: {} as FileInfo,
    },
  }
  try {
    const formData = await request.formData();
    const shareId = formData.get("shareId")
    console.log(shareId)
    if (!shareId) {
      responseTemplate.code = 2;
      responseTemplate.message = "分享ID不存在..."
      responseTemplate.data = {};
      return jsonResponse(responseTemplate);
    }
    let { value, metadata } = await is_metadata_exist(shareId, env);
    let fileInfo = value;
    if (fileInfo) {
      responseTemplate.code = 0;
      responseTemplate.message = "Success";
      responseTemplate.data.file_info = fileInfo;
      responseTemplate.data["share_id"] = shareId;
      responseTemplate.data["share_url"] = shareUrl(shareId);
      responseTemplate.data["timestamp"] = metadata.timestamp;
      if(metadata.sha512) responseTemplate.data["sha512"] = metadata.sha512;
      return jsonResponse(responseTemplate, {
        headers: {
          ...corsHeaders,
          "Access-Control-Allow-Headers": request.headers.get("Access-Control-Request-Headers"),
        }
      })
    }
    else {
      responseTemplate.code = 1;
      responseTemplate.message = "文件不存在...";
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