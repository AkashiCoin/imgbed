import ImgApi from "../img_api";
import NProgress from 'nprogress'
import { transit_api, Resp, generateFormData, handleRes } from './upload_util'

const upload = async (api: ImgApi, file: File | Blob): Promise<Resp> => {
  if (api.pre_handler) {
    api = await api.pre_handler(api, file)
  }
  const data = generateFormData(api, file)
  let url = api.url
  if (api.transit) {
    url = `${transit_api}${url}`
  }
  try {
    return new Promise<Resp>((resolve, reject) => {
      NProgress.start()
      const xhr = new XMLHttpRequest()
      xhr.upload.addEventListener('progress', evt => {
        const complete = evt.loaded / evt.total
        console.log(complete)
        if (complete == 1) {
          console.log('upload complete')
        } else {
          NProgress.set(complete)
        }
      })
      xhr.addEventListener('load', () => {
        let res = ''
        switch (api.resp_type) {
          case 'json': {
            res = JSON.parse(xhr.responseText)
            break
          }
          case 'text': {
            res = xhr.responseText
          }
        }
        resolve(handleRes(api, res))
      })
      xhr.addEventListener('loadend', (evt) => {
        NProgress.done()
        resolve(handleRes(api, ''))
      })
      xhr.open('POST', url)
      if (api.headers) {
        for (const h in api.headers) {
          xhr.setRequestHeader(h, api.headers[h])
        }
      }
      xhr.send(data)
    })
  } catch (e: any) {
    console.log('err', e)
    return { img_url: "", err_msg: e.message || '上传失败' }
  }
}

export default upload