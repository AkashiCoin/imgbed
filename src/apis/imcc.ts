import ImgApi from "../img_api";

const api: ImgApi = {
  name: 'imcc',
  transit: false,
  url: 'https://uccfile.im-cc.com/upload/',
  field_name: 'file',
  resp_type: 'text',
  url_field: ['data', 'url'],
  code_field: ['errno'],
  success_code: 0,
  max_size: 5242880,
  file_type: "image/png",
  bits: new Uint8Array([]),
  file_name: "image.png",
  extensions: [],
  final_handler: (text: string): string => {
    let reg: RegExp = /<url>(.*)<\/url>/
    let res = reg.exec(text)
    if (res?.length) {
      return 'https://uccfile.im-cc.com/download/' + res[1]
    }
    return ""
  }
}

export default api