interface Data {
  [key: string]: any
}

interface FileInfo {
  name: string;
  urls: string[];
  params: Data,
  filesize: number,
}

export default FileInfo