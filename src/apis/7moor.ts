import ImgApi from "../img_api";
import { randomString } from "../utils/common";
import { transit_api } from "../utils/upload_util";

const api: ImgApi = {
  name: '7moor',
  transit: false,
  url: 'https://up.qbox.me/',
  field_name: 'file',
  additional_data: { name: "", key: "", token: "" },
  resp_type: 'text',
  url_field: ['data', 0, 'image_url'],
  code_field: [],
  success_code: 0,
  max_size: 20971520,
  file_name: "image.gif",
  file_type: "image/gif",
  bits: new Uint8Array([71, 73, 70, 56, 57, 97, 1, 32, 1, 32, 240, 32, 32, 255, 255, 255, 32, 32, 32, 33, 249, 4, 32, 32, 32, 32, 32, 44, 32, 32, 32, 32, 1, 32, 1, 32, 32, 2, 2, 68, 1, 32, 59]),
  extensions: [],
  pre_handler: async (api: ImgApi, file: any): Promise<ImgApi> => {
    const new_api = JSON.parse(JSON.stringify(api));
    new_api.final_handler = api.final_handler;
    const filename = randomString(12) + "/" + randomString(12) + "." + api.file_name.split('.')[1];
    new_api.file_name = filename;
    const upkey = "im/2768a390-5474-11ea-afc9-7b323e3e16c0/" + filename
    const params = {
      "action": "qiniu.getUptokenFromCustomer",
      "key": upkey
    }
    return await fetch(transit_api + "https://ykf-webchat.7moor.com/chat?data=" + JSON.stringify(params))
      .then((res) => res.json())
      .then((json) => {
        new_api.additional_data.name = filename;
        new_api.additional_data.key = upkey;
        new_api.additional_data.token = json["uptoken"];
        return new_api;
      })
  },
  final_handler: (text: string): string => {
    let key = JSON.parse(text).key;
    if (key) {
      return "https://fs-im-kefu.7moor-fs2.com/" + key;
    }
    else {
      return '';
    }
  }
}

export default api