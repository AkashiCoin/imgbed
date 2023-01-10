
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
    public formatDate(strDate: any, strFormat?: any) {
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