import ImgApi from "../img_api";

const api: ImgApi = {
  name: 'upload.cc',
  transit: true,
  url: 'https://upload.cc/image_upload',
  field_name: 'uploaded_file[]',
  resp_type: 'json',
  url_field: ['success_image', 0, 'url'],
  code_field: ['code'],
  success_code: 100,
  max_size: 5242880,
  file_type: "image/png",
  bits: new Uint8Array([]),
  file_name: "image.png",
  extensions: [],
  final_handler: (text: string): string => {
    return `https://upload.cc/${text}`
  }
}

export default api