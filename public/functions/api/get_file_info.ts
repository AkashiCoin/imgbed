// ./functions/api/get_file_info.ts

import FileInfo from "./interface";

let FILESLINK;


interface ResponseTemplate {
  code: number,
  message: string,
  fileInfo: FileInfo,
}

const responseTemplate: ResponseTemplate = {
  code: 0,
  message: "",
  fileInfo: {} as FileInfo,
}
const config = {
  domain: "https://img.smoe.top/s/",
  no_ref: "off",
}

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
  "Access-Control-Max-Age": "86400",
}

export const jsonResponse = (value: ResponseTemplate, init: ResponseInit = {}) =>
  new Response(JSON.stringify(value), {
    headers: { "Content-Type": "application/json", ...init.headers },
    ...init,
  });



async function is_key_exist(key: string) {
  let is_exist = await FILESLINK.get(key);
  console.log(is_exist);
  if (is_exist == null) {
    return false;
  } else {
    return is_exist;
  }
}

export const onRequestPost: PagesFunctin<{
  FILESLINK: KVNamespace;
}> = async ({ request, env }) => {
  FILESLINK = env.FILESLINK;
  try {
    const formData = await request.formData();
    const shareId = formData.get("shareId")
    console.log(shareId)
    if (!shareId) {
      responseTemplate.code = 2;
      responseTemplate.message = "分享ID不存在..."
      return jsonResponse(responseTemplate);
    }
    let fileInfo = await is_key_exist(shareId);
    if (fileInfo) {
      responseTemplate.code = 0;
      responseTemplate.message = "Success";
      fileInfo = JSON.parse(fileInfo) as FileInfo;
      fileInfo.params = JSON.parse(fileInfo.params)
      fileInfo.urls = JSON.parse(fileInfo.urls)
      responseTemplate.fileInfo = fileInfo;
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