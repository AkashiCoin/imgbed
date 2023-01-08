import ImgApi from "../img_api";

const api: ImgApi = {
  name: '雷电',
  transit: false,
  url: 'https://bbs.ldmnq.com/api/bbs/upload?dir=topic/attachment',
  field_name: 'file',
  resp_type: 'json',
  url_field: ['data', 'data', 0],
  code_field: [],
  success_code: 0,
  max_size: 5242880,
  file_name: "image.gif",
  file_type: "image/gif",
  bits: new Uint8Array([71, 73, 70, 56, 57, 97, 1, 32, 1, 32, 240, 32, 32, 255, 255, 255, 32, 32, 32, 33, 249, 4, 32, 32, 32, 32, 32, 44, 32, 32, 32, 32, 1, 32, 1, 32, 32, 2, 2, 68, 1, 32, 59]),
  extensions: [],
}

export default api