import ImgApi from "../img_api";

const api: ImgApi = {
  name :'aichat',
  transit: true,
  url:'https://upload.aichat.net/upload/single',
  field_name: 'single',
  resp_type: 'json',
  url_field: ['url'],
  code_field: ['code'],
  success_code: 200,
  max_size: 5242880,
  file_type: "image/png",
  bits: new Uint8Array([]),
  file_name: "image.png",
  extensions: [],
}

export default api;