
/**
 * 时间工具类
 */
export class DateUtil {

    /**
     * 格式化时间
     * 调用formatDate(strDate, 'yyyy-MM-dd');
     * @param strDate（中国标准时间、时间戳等）
     * @param strFormat（返回格式）
     */
    public static formatDate(strDate: any, strFormat?: any) {
        if (!strDate) { return; }
        if (!strFormat) { strFormat = 'yyyy-MM-dd'; }
        switch (typeof strDate) {
            case 'string':
                strDate = new Date(strDate.replace(/-/, '/'));
                break;
            case 'number':
                strDate = new Date(strDate);
                break;
        }
        if (strDate instanceof Date) {
            const dict: any = {
                yyyy: strDate.getFullYear(),
                M: strDate.getMonth() + 1,
                d: strDate.getDate(),
                H: strDate.getHours(),
                m: strDate.getMinutes(),
                s: strDate.getSeconds(),
                MM: ('' + (strDate.getMonth() + 101)).substr(1),
                dd: ('' + (strDate.getDate() + 100)).substr(1),
                HH: ('' + (strDate.getHours() + 100)).substr(1),
                mm: ('' + (strDate.getMinutes() + 100)).substr(1),
                ss: ('' + (strDate.getSeconds() + 100)).substr(1),
            };
            return strFormat.replace(/(yyyy|MM?|dd?|HH?|mm?|ss?)/g, function () {
                return dict[arguments[0]];
            });
        }
    }
}



export const formatSize = (value: number | string) => {
    if (null == value || value == 0) {
        return "0 Bytes";
    }
    const unitArr = new Array("Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB");
    let index = 0;
    let srcsize = typeof value == "string" ? parseFloat(value) : value;
    index = Math.floor(Math.log(srcsize) / Math.log(1024));
    let size = srcsize / Math.pow(1024, index);
    return size.toFixed(2) + unitArr[index];
}

export const equals = (x: any, y: any) => {
    let f1 = x instanceof Object;
    let f2 = y instanceof Object;
    if (!f1 || !f2) {
        return x === y
    }
    if (Object.keys(x).length !== Object.keys(y).length) {
        return false
    }
    for (let p in x) {
        let a = x[p] instanceof Object;
        let b = y[p] instanceof Object;
        if (a && b) {
            equals(x[p], y[p])
        } else if (x[p] != y[p]) {
            return false;
        }
    }
    return true;
}


/**
    * 判断此对象是否是Object类型
    * @param {Object} obj  
    */
function isObject(obj: any) {
    return Object.prototype.toString.call(obj) === '[object Object]';
};
/**
 * 判断此类型是否是Array类型
 * @param {Array} arr 
 */
function isArray(arr: any) {
    return Object.prototype.toString.call(arr) === '[object Array]';
};
/**
 *  深度比较两个对象是否相同
 * @param {Object} oldData 
 * @param {Object} newData 
 */
export function equalsObj(oldData: any, newData: any) {
    // 类型为基本类型时,如果相同,则返回true
    if (oldData === newData) return true;
    if (isObject(oldData) && isObject(newData) && Object.keys(oldData).length === Object.keys(newData).length) {
        // 类型为对象并且元素个数相同

        // 遍历所有对象中所有属性,判断元素是否相同
        for (const key in oldData) {
            if (oldData.hasOwnProperty(key)) {
                if (!equalsObj(oldData[key], newData[key]))
                    // 对象中具有不相同属性 返回false
                    return false;
            }
        }
    } else if (isArray(oldData) && isArray(oldData) && oldData.length === newData.length) {
        // 类型为数组并且数组长度相同

        for (let i = 0, length = oldData.length; i < length; i++) {
            if (!equalsObj(oldData[i], newData[i]))
                // 如果数组元素中具有不相同元素,返回false
                return false;
        }
    } else {
        // 其它类型,均返回false
        return false;
    }

    // 走到这里,说明数组或者对象中所有元素都相同,返回true
    return true;
};

export const equalsJSON = (obj1: any, obj2: any) => {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
}