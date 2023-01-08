import ImgApi from "../img_api";

const api: ImgApi = {
  name: 'ImgBB',
  transit: false,
  url: 'https://zh-cn.imgbb.com/json',
  field_name: 'source',
  additional_data:{
    type: 'file',
    action: 'upload',
  },
  resp_type: 'json',
  url_field: ['image','url'],
  code_field: ['status_code'],
  success_code: 200,
  max_size: 5242880,
  file_type: "image/png",
  bits: new Uint8Array([]),
  file_name: "image.png",
  extensions: [],
}

export default api