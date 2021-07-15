import ImgApi from "../img_api";

const api:ImgApi = {
    name: '搜狐',
    transit: false,
    url: 'http://changyan.sohu.com/api/2/comment/attachment',
    field_name: 'file',
    resp_type: 'text',
    url_field: [''],
    code_field: [],
    success_code: 0,
    max_size: 0,
    extensions: [],
    final_handler: (text:string):string=>{
      return text.substring(12,text.length-4)
    }
}

export default api