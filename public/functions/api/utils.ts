import { ResponseTemplate, Env, FileInfo } from "./interface"

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
export const save_info = async (fileinfo: FileInfo | any, env: Env) => {
    let random_key = await randomString(12);
    let is_exist = await env.FILESLINK.get(random_key);
    console.log(is_exist);
    if (is_exist == null)
        return await env.FILESLINK.put(random_key, JSON.stringify(fileinfo)), random_key;
    else
        save_info(fileinfo, env);
}


export const is_key_exist = async (key: string, env: Env) =>  {
    let is_exist = await env.FILESLINK.get(key, { type: "json", cachesTtl: 31536000});
    console.log(is_exist);
    if (is_exist == null) {
      return false;
    } else {
      return is_exist;
    }
  }

  
export const list_keys = async (limit: number, cursor: number, env: Env) => {
    let list = await env.FILESLINK.list({ limit: limit, cursor: cursor });
    console.log(list);
    if (list == null) {
      return false;
    } else {
      return list;
    }
  }