import ImgApi from "../img_api";

const api: ImgApi = {
  name: '搜狗',
  transit: true,
  url: 'https://pic.sogou.com/pic/upload_pic.jsp',
  field_name: 'upload',
  resp_type: 'text',
  url_field: [],
  code_field: [],
  success_code: 0,
  max_size: 5242880,
  file_type: "image/png",
  bits: new Uint8Array([]),
  file_name: "image.png",
  extensions: [],
}

export default api