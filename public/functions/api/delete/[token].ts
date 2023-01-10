// ./functions/api/get_file_info.ts

import { FileInfo, Env, ResponseTemplate } from "../interface";
import { jsonResponse, corsHeaders, is_key_exist, is_metadata_exist, shareUrl, delete_key } from "../utils";
import config from "../config";

export const onRequest: PagesFunction<Env> = async ({ request, env }) => {
  const responseTemplate: ResponseTemplate = {
    code: 0,
    message: "",
    data: {
      file_info: {} as FileInfo,
      share_url: "",
      timestamp: 0
    },
  }
  let url = new URL(request.url);
  let token = url.pathname.split("/")[3];
  let shareId;
  try {
    if (url.searchParams.get("shareId")) {
      shareId = url.searchParams.get("shareId");
    }
    else {
      const formData = await request.formData();
      shareId = formData.get("shareId")
    }
    console.log(shareId)
    if (!shareId) {
      responseTemplate.code = 2;
      responseTemplate.message = "分享ID不存在..."
      responseTemplate.data = {};
      return jsonResponse(responseTemplate);
    }
    let { value, metadata } = await is_metadata_exist(shareId, env);
    if (value) {
      console.log(metadata);
      if (!metadata) {
        responseTemplate.code = 10;
        responseTemplate.message = "该文件不可删除..."
        responseTemplate.data = {};
        return jsonResponse(responseTemplate, {
          headers: corsHeaders,
        })
      }
      if (metadata.token != token) {
        responseTemplate.code = 11;
        responseTemplate.message = "无权访问该文件";
        responseTemplate.data = {};
        return jsonResponse(responseTemplate, {
          headers: corsHeaders,
        })
      }
      await delete_key(shareId, env);
      responseTemplate.code = 0;
      responseTemplate.message = "Delete Success";
      responseTemplate.data.file_info = value;
      responseTemplate.data.share_url = shareUrl(shareId);
      responseTemplate.data.timestamp = Date.now();
      return jsonResponse(responseTemplate, {
        headers: {
          ...corsHeaders,
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