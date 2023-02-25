// ./functions/api/upload_file_info.ts

import { FileInfo, Env, ResponseTemplate } from "./interface";
import { jsonResponse, corsHeaders, shareUrl, deleteUrl, sha512, is_info_exist, is_metadata_exist, delete_key } from "./utils";
import config from "./config";
import { save_info, randomString } from "./utils";


export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const responseTemplate: ResponseTemplate = {
    code: 0,
    message: "",
    data: {
      filename: "",
      size: 0,
      share_url: "",
      share_id: "",
      delete_url: undefined,
      token: undefined,
      timestamp: 0,
    },
  }
  try {
    const fileInfo = { name: "", filesize: 0 as any, urls: [] as any, params: "" as any }
    const formData = await request.formData();
    formData.forEach((value, key) => key === "timestamp" ? null: fileInfo[key] = value);
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
    fileInfo.params = JSON.parse(fileInfo.params);
    fileInfo.urls = JSON.parse(fileInfo.urls);
    fileInfo.filesize = parseInt(fileInfo.filesize);
    // delete fileInfo.timestamp;
    let token = await randomString(12);
    let random_key: string | undefined;
    let stat: any; 
    let info_sha512: any;
    let timestamp = Date.now();
    let params = { metadata: { token: token, timestamp: timestamp, sha512: info_sha512} };
    if (fileInfo.params.expiration_ttl) {
      params = fileInfo.params.expiration_ttl;
    }
    else if (fileInfo.params.expiration) {
      params = fileInfo.params.expiration;
    }
    if (config.unique_link) {
      info_sha512 = await sha512(JSON.stringify(fileInfo));
      params.metadata.sha512 = info_sha512;
      let { value, metadata } = await is_metadata_exist(info_sha512, env);
      if (value) {
        if ( metadata.token && metadata.timestamp && metadata.sha512 ) {
          token = metadata.token;
          timestamp = metadata.timestamp;
          info_sha512 = metadata.sha512;
          responseTemplate.code = 12;
          responseTemplate.message = "该文件已被分享，不能重复分享...";
          responseTemplate.data.share_url = shareUrl(value.key);
          responseTemplate.data.timestamp = timestamp;
          responseTemplate.data.share_id = value.key;
          responseTemplate.data.filename = fileInfo.name;
          responseTemplate.data.size = parseInt(fileInfo.filesize);
          if (config.unique_link) responseTemplate.data["sha512"] = info_sha512;
          return jsonResponse(responseTemplate, {
            headers: corsHeaders
          })
        }
        else {
          await delete_key(value.key, env);
          let _stat, _random_key = await save_info(fileInfo, env, params);
          stat = _stat;
          random_key = _random_key;
        };
        random_key = value.key;
      } else {
        let _stat, _random_key = await save_info(fileInfo, env, params);
        stat = _stat;
        random_key = _random_key;
        if (typeof stat == "undefined") {
          console.log(await env.FILESLINK.put(info_sha512, JSON.stringify({ key: random_key }), params));
        }
      }
    }
    else {
      let _stat, _random_key = await save_info(fileInfo, env, params);
      stat = _stat;
      random_key = _random_key;
    }
    if (typeof stat == "undefined") {
      responseTemplate.code = 0;
      responseTemplate.message = "Success";
      responseTemplate.data.share_url = shareUrl(random_key);
      responseTemplate.data.timestamp = timestamp;
      responseTemplate.data.delete_url = deleteUrl(random_key, token);
      responseTemplate.data.token = token;
      responseTemplate.data.share_id = random_key;
      responseTemplate.data.filename = fileInfo.name;
      responseTemplate.data.size = parseInt(fileInfo.filesize);
      if (config.unique_link) responseTemplate.data["sha512"] = info_sha512;
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