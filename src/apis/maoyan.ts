import ImgApi from "../img_api";

const api: ImgApi = {
  name: '猫眼电影',
  transit: true,
  url: 'https://maoyan.com/ajax/proxy/admin/mmdb/photos/upload.json',
  field_name: 'file',
  resp_type: 'json',
  url_field: ['data', 0, 'olink'],
  code_field: [],
  success_code: 0,
  max_size: 5242880,
  file_type: "image/png",
  bits: new Uint8Array([]),
  file_name: "image.png",
  extensions: [],
}

export default api