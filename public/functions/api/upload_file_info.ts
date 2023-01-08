// ./functions/api/upload_file_info.ts

import FileInfo from "./interface";


let FILESLINK;

interface ResponseTemplate {
  code: number,
  message: string,
  shareLink: string,
}

const responseTemplate: ResponseTemplate = {
  code: 0,
  message: "",
  shareLink: "",
}

const config = {
  domain: "https://img.smoe.top/s/",
  no_ref: "off",
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
  "Access-Control-Max-Age": "86400",
}

export const jsonResponse = (value: ResponseTemplate, init: ResponseInit = {}) =>
  new Response(JSON.stringify(value), {
    headers: { "Content-Type": "application/json", ...init.headers },
    ...init,
  });


async function randomString(len: number) {
  len = len || 8;
  let $chars = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678";
  let maxPos = $chars.length;
  let result = "";
  for (let i = 0; i < len; i++) {
    result += $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return result;
}

async function save_info(fileinfo) {
  let random_key = await randomString(12);
  let is_exist = await FILESLINK.get(random_key);
  console.log(is_exist);
  if (is_exist == null)
    return await FILESLINK.put(random_key, JSON.stringify(fileinfo)), random_key;
  else
    save_info(fileinfo);
}

export const onRequestPost: PagesFunctin<{
  FILESLINK: KVNamespace;
}> = async ({ request, env }) => {
  FILESLINK = env.FILESLINK;
  try {
    const fileInfo: FileInfo = { name: "", filesize: 0, urls: [], params: { padding: 0 } }
    const formData = await request.formData();
    formData.forEach((value, key) => fileInfo[key] = value);
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
    let stat, random_key = await save_info(fileInfo);
    if (typeof stat == "undefined") {
      responseTemplate.code = 0;
      responseTemplate.message = "Success";
      responseTemplate.shareLink = config.domain + random_key;
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