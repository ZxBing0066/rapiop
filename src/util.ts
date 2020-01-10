export function isObject(obj: any): boolean {
    return {}.toString.call(obj) === '[object Object]';
}
export function isArray(obj: any): boolean {
    return Array.isArray(obj);
}
