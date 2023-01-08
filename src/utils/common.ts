
// 注册 service worker
async function register() {
    const registed = await navigator.serviceWorker.getRegistration("./");
    if (registed?.active) return registed.active;
  
    const swRegistration = await navigator.serviceWorker.register("service-worker.js", {
      scope: "./",
    });
  
    const sw = swRegistration.installing! || swRegistration.waiting!;
  
    let listen: any;
  
    return new Promise<ServiceWorker>((resolve) => {
      sw.addEventListener(
        "statechange",
        (listen = () => {
          if (sw.state === "activated") {
            sw.removeEventListener("statechange", listen);
            resolve(swRegistration.active!);
          }
        })
      );
    });
  }
  
  // 向 service worker 申请下载资源
  export async function createDownloadStream(filename: string, filesize: number) {
    const { port1, port2 } = new MessageChannel();
  
    const sw = await register();
  
    sw.postMessage({ filename, filesize }, [port2]);
  
    return new Promise<WritableStream>((r) => {
      port1.onmessage = (e) => {
        const iframe = document.createElement("iframe");
        iframe.hidden = true;
        iframe.src = e.data.download;
        iframe.name = "iframe";
        document.body.appendChild(iframe);
        r(e.data.writable);
      };
    });
  }
  