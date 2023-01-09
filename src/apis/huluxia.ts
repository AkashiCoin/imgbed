import ImgApi from "../img_api";

const api: ImgApi = {
  name: '葫芦侠',
  transit: true,
  url: 'https://upload.huluxia.net/upload/image/avatar',
  field_name: 'file',
  resp_type: 'json',
  url_field: ['url'],
  code_field: ['status'],
  success_code: 1,
  max_size: 3145728,
  file_type: "image/png",
  bits: new Uint8Array([]),
  file_name: "image.png",
  extensions: [],  
}

export default api