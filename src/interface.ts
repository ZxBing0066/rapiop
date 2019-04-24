// 子项目的配置信息
export interface ProjectConfig {
    // file path
    file?: string[];
    // link address
    href?: string;
    // string regexp of match router
    url?: string;
    // how to mount project
    mode?: 'iframe';
    // other config
    [other: string]: any;
}

// 动态获取的项目配置
export interface Config {
    [key: string]: ProjectConfig;
}

// 实例的初始化配置
export interface Option {
    plugins?: any[];
    services?: any[];
    frameKey?: string;
    homeKey?: string;
    getConfig(): Promise<Config>;
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
    bind: (app: any) => void;
    [propName: string]: any;
}
