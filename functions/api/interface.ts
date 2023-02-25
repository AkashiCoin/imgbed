interface Data {
  [key: string]: any
}

export interface FileInfo {
  name: string;
  urls: string[];
  params: Data,
  filesize: number,
}

export interface Env {
  FILESLINK: KVNamespace;
}

export interface ResponseTemplate {
  code: number,
  message: string,
  data: Data,
}