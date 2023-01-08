import ImgApi from "../img_api";

const api: ImgApi = {
  name: 'CC客服',
  transit: true,
  url: 'https://kefu.cckefu1.com/vclient/chat/uploader.php',
  field_name: 'vclient_file',
  additional_data: { type: 'feedback' },
  resp_type: 'json',
  url_field: ['url'],
  code_field: ['errno'],
  success_code: 0,
  max_size: 9437184,
  file_type: "image/png",
  bits: new Uint8Array([]),
  file_name: "image.png",
  extensions: [],
}

export default api