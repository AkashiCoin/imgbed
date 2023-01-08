import ImgApi from "../img_api";

const api: ImgApi = {
  name: '大众点评',
  transit: true,
  url: 'https://kf.dianping.com/api/file/burstUploadFile',
  field_name: 'files',
  headers: {
    'CSC-VisitId': 'access-ba00ca3b-fa67-4a4f-b5d5-4522e8788ba5'
  },
  additional_data: {
    part: 0,
    partSize: 1,
    fileName: 'meituan',
    fileID: '453573879545378'
  },
  resp_type: 'json',
  url_field: ['data', 'uploadPath'],
  code_field: ['code'],
  success_code: 200,
  max_size: 5242880,
  file_type: "image/png",
  bits: new Uint8Array([]),
  file_name: "image.png",
  extensions: [],
}

export default api