import { Config } from '../interface';

// 根据路径和子项目的配置等获取匹配的项目
export function getProjectkeyFromPath(path: string, config: Config) {
    const keys = Object.keys(config);
    const routerKey = keys.find(key => {
        const url = config[key].url;
        return url && new RegExp(url).test(path);
    });
    return routerKey;
}
