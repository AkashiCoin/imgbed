// ./functions/api/get_all_file.ts

import { FileInfo, Env, ResponseTemplate} from "../interface";
import { jsonResponse, corsHeaders, list_keys, is_key_exist } from "../utils";
import config from "../config";

let FILESLINK;

export const onRequestPost: PagesFunctin<Env> = async ({ request, env }) => {
  FILESLINK = env.FILESLINK;
  const responseTemplate: ResponseTemplate = {
    code: 0,
    message: "",
    data: {
      filesInfo: []
    },
  }
  try {
    const formData = await request.formData();
    let limit = formData.get("limit")
    let cursor = formData.get("cursor")
    if (!limit) limit = config.limit;
    console.log(limit)
    let filesInfo = await list_keys(limit, cursor, env);
    if (filesInfo) {
      responseTemplate.code = 0;
      responseTemplate.message = "Success";
      for (let key of filesInfo.keys){
        let fileInfo = await is_key_exist(key.name, env);
        if (fileInfo) {
          responseTemplate.data.filesInfo.push(fileInfo);
        }
      }
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