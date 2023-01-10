import FileInfo from "../file_info";
import { equals, equalsJSON, equalsObj } from "../utils/util";

export const metadata_key = "FS_Metadata";
export const file_data_key = "FS_FileData";

export interface FileData {
    file_info: FileInfo;
    share_url: string;
    share_id: string;
    timestamp: number;
    sha512: string;
}

/**
 * 封装操作localstorage本地存储的方法
 */
export const storage = {
    //存储
    set(key: string, value: any) {
        localStorage.setItem(key, JSON.stringify(value))
    },
    //取出数据
    get<T>(key: string) {
        const value = localStorage.getItem(key)
        if (value && value != "undefined" && value != "null") {
            return <T>JSON.parse(value)
        }
    },
    // 删除数据
    remove(key: string) {
        localStorage.removeItem(key)
    },
    // 添加数据
    push(key: string, value: any) {
        let arr: any = this.get(key);
        if (!arr) {
            arr = [];
        }
        let v = arr.filter((v: any) => equalsObj(v, value))
        if (v.length > 0) {
            return;
        }
        arr.push(value);
        this.set(key, arr);
    },
    // 删除数据
    pop(key: string, value: any) {
        let arr: any = this.get(key);
        if (!arr) {
            arr = [];
        }
        let i = this.indexOf(key, value);
        if (i != -1) {
            let v = arr.splice(i, 1);
            this.set(key, arr);
            return v;
        }
        return null;
    },
    indexOf(key: string, value: any) {
        let arr: any = this.get(key);
        if (!arr) {
            arr = [];
        }
        let v = arr.filter((v: any) => equalsObj(v, value))
        console.log(v)
        if (v.length > 0) {
            return arr.indexOf(v[0]);
        }
        return -1;
    },
    edit(key: string, i: number, value: any) {
        console.log(i);
        if (i < 0) return this.push(key, value);
        let arr: any = this.get(key);
        if (!arr) {
            arr = [];
        }
        if ( arr.length > i) arr[i] = value;
        else return false;
        this.set(key, arr);
        return true;
    }
};

/**
 * 封装操作sessionStorage本地存储的方法
 */
export const sessionStorage = {
    //存储
    set(key: string, value: any) {
        window.sessionStorage.setItem(key, JSON.stringify(value))
    },
    //取出数据
    get<T>(key: string) {
        const value = window.sessionStorage.getItem(key)
        if (value && value != "undefined" && value != "null") {
            return JSON.parse(value)
        }
        return null
    },
    // 删除数据
    remove(key: string) {
        window.sessionStorage.removeItem(key)
    },
    // 添加数据
    push(key: string, value: any) {
        let arr: any = this.get(key);
        if (!arr) {
            arr = [];
        }
        if (arr.indexOf(value) != -1) {
            return;
        }
        arr.push(value);
        this.set(key, arr);
    },
    // 删除数据
    pop(key: string, value: any) {
        let arr: any = this.get(key);
        if (!arr) {
            arr = [];
        }
        let v = arr.splice(arr.indexOf(value));
        this.set(key, arr);
        return v;
    }
}

export const file_data = {
    save(data: any, params?: any) {
        let _data = this.get(data);
        if (!_data) {
            _data = {
                file_info: data,
                share_url: "",
                share_id: "",
                timestamp: 0,
                sha512: "",
            }
        }
        if (params) {
            for (const key in params) {
                if (key !== "file_info")
                    _data[key] = params[key];
            }
        }
        return storage.edit(file_data_key, this.indexOf(data), _data);
    },
    getAll() {
        return this.migrate() as FileData[];
    },
    get(data?: any) {
        if (data) {
            let f = this.migrate().filter((v: FileData) => equalsObj(v.file_info, data))
            console.log(f);
            if (f) return f[0];
            return null;
        }
        let all = this.migrate();
        let arr: FileInfo[] = [];
        all.forEach((v: FileData) => {
            arr.push(v.file_info);
        })
        return arr as FileInfo[];
    },
    delete(data: any) {
        return storage.pop(file_data_key, this.get(data));
    },
    indexOf(data: any) {
        let arr = this.get();
        let v = arr.filter((v: any) => equalsObj(v, data));
        if (v.length > 0) {
            return arr.indexOf(v[0]);
        }
        return -1;
    },
    migrate() {
        let arr: any = storage.get(file_data_key);
        if (!arr) {
            arr = [];
        }
        if (arr.length !==0 && !arr[0].file_info) {
            let arr2: FileData[] = [];
            arr.forEach((v: any) => {
                arr2.push({
                    file_info: v,
                    share_url: "",
                    share_id: "",
                    timestamp: 0,
                    sha512: "",
                })
            })
            storage.set(file_data_key, arr2);
            return arr2;
        }
        return arr;
    }
}

export const metadata = {
    save(data: any) {
        storage.push(metadata_key, data);
    },
    get() {
        return storage.get(metadata_key) as [];
    },
    delete(data: any) {
        return storage.pop(metadata_key, data);
    },
}