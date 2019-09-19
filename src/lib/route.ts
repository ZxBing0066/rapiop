import { Config } from '../interface';

// 根据路径和子项目的配置等获取匹配的项目
export function getProjectkeyFromPath(path: string, config: Config = {}) {
    const keys = Object.keys(config);
    const routerKey = keys.find(key => {
        const { regexp, matcher, prefix } = config[key];
        if (matcher) {
            return matcher(path);
        } else if (regexp) {
            return new RegExp(regexp).test(path);
        } else if (prefix) {
            return path.indexOf(prefix) === 0;
        }
    });
    return routerKey;
}
