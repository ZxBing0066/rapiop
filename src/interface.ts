// 任意函数
export type AnyFunction = (...args: any[]) => any;

// 错误回调
export type OnError = (err: Error) => void;

// 子项目的配置信息
export interface ProjectConfig {
    // file path
    files?: string[];
    // simply set a prefix to match router
    prefix?: string;
    // string regexp of match router
    regexp?: string;
    // matcher for match router
    matcher?: AnyFunction;
    // other config
    [other: string]: any;
}

// 动态获取的项目配置
export interface Config {
    [key: string]: ProjectConfig;
}

export type GetConfig = () => Promise<Config>;

// 实例的初始化配置
export interface Option {
    config: Config | GetConfig;
    history: { listen: (listener: AnyFunction) => {} };
    plugins?: any[];
    fallbackProjectKey?: string;
    mountDOM?: Element;
    onError?: OnError;
    cacheBeforeRun?: boolean;
    [propName: string]: any;
}
export interface ProjectOption {
    [prop: string]: any;
}

// 子项目注册时注入的配置信息
export interface ProjectRegisterConfig {
    mount: (mountDOM: Element) => void | Promise<any>;
    unmount: (mountDOM: Element) => void | Promise<any>;
    // 运行时注入参数
    option?: any;
}

// 所有的子项目运行时配置信息
export interface RegisterConfig {
    [projectKey: string]: ProjectRegisterConfig;
}

// 插件
export interface Plugin {
    call: (app: any) => void;
}

// 调试参数
export interface DebugOptions {
    devProjectKey?: string;
}

// 内部共享实例
export interface InnerShared {
    loadResources: (projectConfig: ProjectConfig, onError: OnError) => void;
}
