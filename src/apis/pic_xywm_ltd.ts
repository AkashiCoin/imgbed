import ImgApi from "../img_api";

const api: ImgApi = {
  name: '图片储存',
  transit: true,
  url: 'https://pic.xywm.ltd/api/upload',
  field_name: 'image',
  resp_type: 'json',
  url_field: ['data','url'],
  code_field: ['code'],
  success_code: 200,
  max_size: 5242880,
  file_type: "image/png",
  bits: new Uint8Array([]),
  file_name: "image.png",
  extensions: [],
}

export default api