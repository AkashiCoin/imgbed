import ImgApi from "../img_api";

const api: ImgApi = {
  name: '腾讯',
  transit: true,
  url: 'https://om.qq.com/image/orginalupload',
  field_name: 'Filedata',
  resp_type: 'json',
  url_field: ['data', 'url'],
  code_field: ['response', 'code'],
  success_code: 0,
  max_size: 5242880,
  file_type: "image/png",
  bits: new Uint8Array([]),
  file_name: "image.png",
  extensions: [],
}

export default api