import NProgress from 'nprogress'
import FileInfo from "../file_info";
import { createDownloadStream } from "./common";
import { cancelReaders, preCheck } from './download_utils';


let completions = 0;
let jsonData: FileInfo;
let controller: AbortController;

export interface Resp {
  code: number,
  message: string,
  data: any,
}

export const addNProgress = async () => {
  completions = completions + 1;
  NProgress.set(completions / jsonData.urls.length);
}

export const download_chunk = async (
  url: string,
  writable: WritableStreamDefaultWriter<any>,
  signal: AbortSignal
) => {
  return fetch(url, {
    headers: {
      range: `bytes=${jsonData.params.padding}-`,
    },
    signal: signal,
  }).then(async (res) => {
    const reader = res.body!.getReader();
    let ret: any[] = [];
    const pump = async () => {
      const { done, value } = await reader.read();
      if (done) {
        await addNProgress();
        // ElMessage.success("[" + completions + "/" + jsonData.urls.length + "] 分片下载成功...")
        return writable.close();
      }
      let p = await writable.write(value);
      ret.push(p);
      Promise.all(ret);
      pump();
    };
    pump();
  });
};

export const readStream = (readers: ReadableStreamDefaultReader<any>[], writable: WritableStreamDefaultWriter) => {
  return new Promise((resolve, reject) => {
    const readStream = async (i: number) => {
      if (i == jsonData.urls.length) {
        if (controller.signal.aborted) {
          resolve(true);
          return;
        }
        console.log("读取完成");
        NProgress.done();
        writable.close();
        resolve(true);
        return;
      }
      const { done, value } = await readers[i].read();
      if (done) {
        readStream(i + 1);
        return;
      }
      try {
        await writable.write(value).then(() => readStream(i));
      } catch {
        if (!controller.signal.aborted) {
          console.log("下载线程已取消...")
          NProgress.done();
          cancelReaders(readers);
          controller.abort();
        }
        resolve(false);
      }
    };
    readStream(0);
  })

}

const poolDownload = async (file_info: FileInfo): Promise<Resp> => {
  if (!preCheck(file_info)) return { code: 3, message: "文件信息解析失败...", data: {} } as Resp
  jsonData = file_info;
  controller = new AbortController();
  const resp = { code: 0, message: "", data: {} } as Resp;
  completions = 0;
  NProgress.start();
  const writableStream = await createDownloadStream(
    jsonData.name,
    jsonData.filesize
  );
  const writable = writableStream.getWriter();
  const readers: ReadableStreamDefaultReader<any>[] = [];
  const ret: any[] = [];
  jsonData.urls.forEach(async (url) => {
    let transfromStream = new TransformStream();
    readers.push(transfromStream.readable.getReader());
    let p = await download_chunk(url, transfromStream.writable.getWriter(), controller.signal).catch(
      (err) => {
        if (!controller.signal.aborted) {
          resp.code = 2;
          resp.message = "下载失败...";
          console.error("发生了一些错误：" + err);
          NProgress.done();
          controller.abort();
          cancelReaders(readers);
        }
      }
    );
    ret.push(p);
  });
  return await readStream(readers, writable).then((e) => {
    console.log(e)
    if (e && resp.code == 0) {
      resp.message = "下载成功...";
    }
    else if (!e) {
      resp.code = 1;
      resp.message = "下载已取消...";
      controller.abort();
    }
    return resp;
  });
};

export default poolDownload