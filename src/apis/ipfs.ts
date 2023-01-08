import ImgApi from "../img_api";

const api: ImgApi = {
  name: 'IPFS',
  transit: true,
  url: 'https://ipfs.infura.io:5001/api/v0/add',
  field_name: 'file',
  resp_type: 'json',
  url_field: ['Hash'],
  code_field: [],
  success_code: 0,
  max_size: 5242880,
  file_type: "image/png",
  bits: new Uint8Array([]),
  file_name: "image.png",
  extensions: [],
  final_handler: (text: string): string => {
    return `https://ipfs.decoo.io/ipfs/${text}`
  }
}

export default api