import FileInfo from "../file_info";
import { equals } from "../utils/util";

export const metadata_key = "FS_Metadata";
export const file_data_key = "FS_FileData";

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
        let v = arr.filter((v: any) => equals(v, value))
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
        let v = arr.filter((v: any) => equals(v, value))
        if (v.length > 0) {
            return arr.indexOf(v[0]);
        }
        return -1;
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

export const saveMetadata = (data: any) => {
    storage.push(metadata_key, data);
};

export const getMetadata = () => {
    return storage.get(metadata_key) as [];
};

export const deleteMetadata = (data: any) => {
    return storage.pop(metadata_key, data);
};

export const saveFileData = (data: any) => {
    storage.push(file_data_key, data);
};

export const getFileData = () => {
    return storage.get(file_data_key) as FileInfo[];
};

export const deleteFileData = (data: any) => {
    return storage.pop(file_data_key, data);
};