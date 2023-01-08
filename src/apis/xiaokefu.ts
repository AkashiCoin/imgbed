import ImgApi from "../img_api";

const api: ImgApi = {
  name: '小客服',
  transit: false,
  url: 'https://xiaokefu.com.cn/pcAccess/H5UploadImage',
  field_name: 'file',
  additional_data: { token: "d2c284db92c9b3aaf844ed38da395962", id: "8" },
  resp_type: 'json',
  url_field: ['data', 0, 'image_url'],
  code_field: [],
  success_code: 0,
  max_size: 20971520,
  file_name: "image.gif",
  file_type: "image/gif",
  bits: new Uint8Array([71, 73, 70, 56, 57, 97, 1, 32, 1, 32, 240, 32, 32, 255, 255, 255, 32, 32, 32, 33, 249, 4, 32, 32, 32, 32, 32, 44, 32, 32, 32, 32, 1, 32, 1, 32, 32, 2, 2, 68, 1, 32, 59]),
  extensions: [],
}

export default api