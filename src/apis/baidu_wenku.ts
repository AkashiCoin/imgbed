import ImgApi from "../img_api";

const api: ImgApi = {
  name: '百度文库',
  transit: true,
  url: 'https://wenku.baidu.com/user/api/editorimg',
  field_name: 'file',
  resp_type: 'json',
  url_field: ['link'],
  code_field: [],
  success_code: 0,
  max_size: 5242880,
  file_type: "image/png",
  bits: new Uint8Array([]),
  file_name: "image.png",
  extensions: [],
}

export default api