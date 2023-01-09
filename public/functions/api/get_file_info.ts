// ./functions/api/get_file_info.ts

import { FileInfo, Env, ResponseTemplate} from "./interface";
import { jsonResponse, corsHeaders, is_key_exist } from "./utils";
import config from "./config";

export const onRequestPost: PagesFunctin<Env> = async ({ request, env }) => {
  const responseTemplate: ResponseTemplate = {
    code: 0,
    message: "",
    data: {
      fileInfo: {} as FileInfo
    },
  }
  try {
    const formData = await request.formData();
    const shareId = formData.get("shareId")
    console.log(shareId)
    if (!shareId) {
      responseTemplate.code = 2;
      responseTemplate.message = "分享ID不存在..."
      return jsonResponse(responseTemplate);
    }
    let fileInfo = await is_key_exist(shareId, env);
    if (fileInfo) {
      responseTemplate.code = 0;
      responseTemplate.message = "Success";
      responseTemplate.data.fileInfo = fileInfo;
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