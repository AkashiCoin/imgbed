import ImgApi from "../img_api";

const api: ImgApi = {
  name: 'OPPO',
  transit: false,
  url: 'https://api.open.oppomobile.com/api/utility/upload',
  field_name: 'file',
  additional_data: { type: 'feedback' },
  resp_type: 'json',
  url_field: ['data', 'url'],
  code_field: ['errno'],
  success_code: 0,
  max_size: 5242880,
  file_type: "image/png",
  bits: new Uint8Array([]),
  file_name: "image.png",
  extensions: [],
  final_handler: (text: string): string => {
    return text.replace('store2', 'store')
  },
}

export default api