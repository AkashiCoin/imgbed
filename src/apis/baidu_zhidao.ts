import ImgApi from "../img_api";

const api: ImgApi = {
  name: '百度知道',
  transit: true,
  url: 'https://zhidao.baidu.com/submit/ajax/',
  field_name: 'image',
  additional_data: { cm: 100672 },
  resp_type: 'json',
  url_field: ['url'],
  code_field: ['errorNo'],
  success_code: 0,
  max_size: 5242880,
  file_type: "image/png",
  bits: new Uint8Array([]),
  file_name: "image.png",
  extensions: [],
}

export default api