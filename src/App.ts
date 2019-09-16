import _ from 'lodash';

import { loadResources } from './lib/load';
import { Event, EVENT_TYPES } from './lib/event';
import { getProjectkeyFromPath } from './lib/route';
import { Config, Option, ProjectOption, RegisterConfig, Plugin, DebugOptions } from './interface';

const isInIframe = window.self !== window.top;

const MESSAGE_TYPE = 'RAPIOP_MESSAGE';

type AnyFunction = (...args: any[]) => any;

export default class App {
    // 事件器
    public event: Event = new Event();
    // 根节点, for frame mount
    // frame输出的节点, for project mount
    mountDOM: Element;
    // iframe模式的iframe容器
    iframeDOM: Element;
    // 首页的项目key
    homeKey: string;
    // history对象
    history: {
        listen: (listener: (url: string) => void) => void;
        [key: string]: any;
    };
    // 路由配置, 项目配置等从服务器或其它地方获取的配置
    config: Config;
    // 项目配置, 存储运行时项目注入的配置
    registerConfig: RegisterConfig = {};
    // 当前已mount的项目
    mountedProjectKey: string = null;
    // mount锁
    domLock: boolean = false;
    // mount锁时，进入等待状态
    waiting: boolean = false;
    // 初始化是否完成
    inited: boolean = false;
    // 错误回调
    onError: (e: Error) => void;
    hooks: {
        [key: string]: AnyFunction;
    } = {};
    // 所有事件，方便外部获取
    public EVENT_TYPES = EVENT_TYPES;
    // frame是否已注册
    frameRegistered: boolean = false;
    // 加载文件时先缓存所有文件，然后执行
    cacheBeforeRun: boolean;
    // 调试用参数
    debugOptions: DebugOptions;
    constructor(option: Option) {
        this.event.dispatchEvent(EVENT_TYPES.BEFORE_INIT);
        this.init(option);
    }
    // 项目初始化
    init = (option: Option) => {
        const {
            plugins = [],
            frameKey = 'frame',
            homeKey = 'home',
            cacheBeforeRun = true,
            getConfig,
            onError = () => {},
            debug = {},
            hooks = {},
            history
        } = option;
        if (!getConfig) {
            console.error(`Must provide getConfig when init App`);
            return;
        }
        this.cacheBeforeRun = cacheBeforeRun;
        this.hooks = hooks;
        this.debugOptions = debug;
        this.history = history;
        // 无匹配的项目匹配到home
        this.homeKey = homeKey;
        // 错误时的处理回调
        this.onError = onError;
        // 注册插件
        plugins.forEach(plugin => {
            this.registerPlugin(plugin);
        });
        if (isInIframe) {
            this.initIframe();
        } else {
            this.initParent();
        }
        // 获取配置信息
        getConfig()
            .then(config => {
                this.config = config;

                // 事件监听
                this.event.addEventListener(EVENT_TYPES.PATH_CHANGE, this.refresh);
                this.event.addEventListener(EVENT_TYPES.AFTER_FRAME_MOUNT, this.refresh);
                this.event.addEventListener(EVENT_TYPES.AFTER_REGISTER, this.refresh);
                this.event.addEventListener(EVENT_TYPES.UNLOCK_DOM, () => {
                    if (this.waiting) {
                        this.waiting = false;
                        this.refresh();
                    }
                });

                // 路由变化监听
                const historyHandler = () => {
                    this.event.dispatchEvent(EVENT_TYPES.PATH_CHANGE);
                };
                this.history.listen(() => historyHandler());
                // dispatch history change after init
                historyHandler();
                // 调试frame或iframe中时不做frame加载
                if (this.debugOptions.devProjectKey !== frameKey && !isInIframe && !this.frameRegistered) {
                    const frameConfig = this.config[frameKey] || {};
                    loadResources(frameConfig.files || frameConfig.file, false, this.onError);
                }
                this.event.dispatchEvent(EVENT_TYPES.AFTER_INIT);
                this.inited = true;
            })
            .catch(e => {
                this.event.dispatchEvent(EVENT_TYPES.ERROR, e);
            });
    };
    initParent = () => {
        // 监听来自iframe的事件同步信息
        window.addEventListener('message', e => {
            if (e.data && e.data.type === MESSAGE_TYPE) {
                const { eventType, info } = e.data;
                switch (eventType) {
                    case EVENT_TYPES.AFTER_REGISTER:
                    case EVENT_TYPES.BEFORE_MOUNT:
                    case EVENT_TYPES.AFTER_MOUNT:
                    case EVENT_TYPES.BEFORE_UNMOUNT:
                    case EVENT_TYPES.AFTER_UNMOUNT: {
                        this.event.dispatchEvent(eventType, info);
                        break;
                    }
                    case EVENT_TYPES.PATH_CHANGE: {
                        this.navigate(info.url);
                        break;
                    }
                    default:
                        console.warn(`Unknown message: `, e);
                        break;
                }
            }
        });
    };
    initIframe = () => {
        const mountDOM = document.createElement('div');
        mountDOM.style.width = '100%';
        mountDOM.style.height = '100%';
        mountDOM.style.overflow = 'auto';
        document.body.appendChild(mountDOM);
        this.mountDOM = mountDOM;
    };
    // 同步信息到iframe上层window
    private syncEvent = (eventType: string, info?: any) => {
        if (isInIframe) {
            window.top.postMessage(
                {
                    type: MESSAGE_TYPE,
                    eventType,
                    info
                },
                '/'
            );
        }
    };
    dispatchAndSyncEvent = (eventType: string, info?: any) => {
        this.event.dispatchEvent(eventType, info);
        this.syncEvent(eventType, info);
    };
    // 插件注册
    registerPlugin = (plugin: Plugin) => {
        plugin.bind(this);
    };
    registryFrame = (...args: any[]) => {
        console.warn('Please use registerFrame to instead of registryFrame');
        // @ts-ignore
        this.registerFrame(...args);
    };
    // 注册ui架子
    public registerFrame = (frameMount: () => Promise<Element>) => {
        if (isInIframe) {
            return console.warn("Can't call registerFrame in iframe");
        }
        if (this.frameRegistered) {
            return console.error(`Cant't call registerFrame multiple times`);
        }
        this.frameRegistered = true;
        const mountFrame = () => {
            frameMount().then((mountDOM: Element) => {
                this.mountDOM = mountDOM;
                this.event.dispatchEvent(EVENT_TYPES.AFTER_FRAME_MOUNT);
            });
        };
        this.event.dispatchEvent(EVENT_TYPES.AFTER_FRAME_REGISTER);
        if (this.inited) {
            mountFrame();
        } else {
            this.event.addEventListener(EVENT_TYPES.AFTER_INIT, mountFrame);
        }
    };
    /** @deprecated */
    registry = (...args: any[]) => {
        console.warn('Please use register to instead of registry');
        // @ts-ignore
        this.register(...args);
    };
    // 注册子项目
    public register = (
        projectKey: string,
        mount: (mountDOM: Element) => void,
        unmount: () => void,
        option: ProjectOption
    ) => {
        if (this.registerConfig[projectKey]) {
            return console.error(`Project: ${projectKey} was registered`);
        }
        this.registerConfig[projectKey] = {
            mount,
            unmount,
            option
        };
        this.dispatchAndSyncEvent(EVENT_TYPES.AFTER_REGISTER);
    };
    // 刷新
    refresh = () => {
        if (this.domLock) {
            this.waiting = true;
        } else {
            this._mount();
        }
    };
    withHook = (hookName: string, originHandle: AnyFunction, args: any) => {
        const hook = this.hooks[hookName];
        if (hook) {
            return hook(originHandle, args);
        } else {
            return originHandle;
        }
    };
    private _mount = () => {
        const projectKey = getProjectkeyFromPath(location.pathname, this.config) || this.homeKey;
        // 匹配的项目未改变，不处理
        if (this.mountedProjectKey === projectKey) {
            console.info(`Project ${projectKey} was mounted`);
            return;
        }
        // mountDOM为空时frame还未加载或初始化未完成，不处理
        if (!this.mountDOM) {
            console.info(`mountDOM didn't provided`);
            return;
        }
        // 清理已mount项目
        const unmountResult = this.unmount();
        let handler = Promise.resolve();
        if (unmountResult && unmountResult.then) {
            handler = unmountResult;
        }
        handler.then(() => {
            const projectConfig = this.config[projectKey] || {};
            if (projectConfig.mode === 'iframe' && !isInIframe) {
                // iframe mode 项目，直接创建iframe容器，mount在iframe中完成
                this.mountedProjectKey = projectKey;
                const iframeDOM = document.createElement('iframe');
                iframeDOM.frameBorder = '0';
                iframeDOM.width = '100%';
                iframeDOM.height = '100%';
                iframeDOM.style.display = 'block';
                iframeDOM.src = location.href;
                this.mountDOM.appendChild(iframeDOM);
                this.iframeDOM = iframeDOM;
            } else {
                // 非iframe项目，直接load文件，并退出等待文件加载完成再次处理
                const projectRegisterConfig = this.registerConfig[projectKey];
                if (!projectRegisterConfig) {
                    console.info(`project didn't loaded`);
                    if (_.isEmpty(projectConfig.files || projectConfig.file)) {
                        console.warn(`project ${projectKey} has no file`);
                        return;
                    }
                    if (this.debugOptions.devProjectKey === projectKey) {
                        console.warn(`debug project ${projectKey} without load file`);
                        return;
                    }
                    loadResources(
                        projectConfig.files || projectConfig.file,
                        this.cacheBeforeRun && !this.debugOptions.devProjectKey,
                        this.onError
                    );
                    return;
                }
                // 已经load时，触发mount
                const { mount } = projectRegisterConfig;
                if (!mount) {
                    console.error(`mount of project: ${projectKey} not exist`);
                    return;
                }

                this.domLock = true;
                this.dispatchAndSyncEvent(EVENT_TYPES.BEFORE_MOUNT, {
                    projectKey,
                    config: projectConfig,
                    option: projectRegisterConfig.option
                });
                this.mountedProjectKey = projectKey;
                const mountWithHook = this.withHook('mount', mount, { projectKey });
                // 返回promise时等待处理完成
                const mountResult = mountWithHook(this.mountDOM);
                let handler = Promise.resolve();
                if (mountResult && mountResult.then) {
                    handler = mountResult;
                }
                handler.then(() => {
                    this.dispatchAndSyncEvent(EVENT_TYPES.AFTER_MOUNT);
                    this.domLock = false;
                    this.event.dispatchEvent(EVENT_TYPES.UNLOCK_DOM);
                });
            }
        });
    };
    private unmount = (): Promise<void> => {
        // 有项目mount时，销毁
        const mountedProjectKey = this.mountedProjectKey;
        const mountedProjectKeyConfig = this.config[mountedProjectKey] || {};
        if (mountedProjectKey) {
            const mode = mountedProjectKeyConfig.mode;
            if (mode === 'iframe') {
                this.event.dispatchEvent(EVENT_TYPES.BEFORE_UNMOUNT);
                this.mountedProjectKey = null;
                // 之前的项目是iframe模式，清理iframe
                this.iframeDOM && this.iframeDOM.parentNode && this.iframeDOM.parentNode.removeChild(this.iframeDOM);
                this.event.dispatchEvent(EVENT_TYPES.AFTER_UNMOUNT);
            } else {
                this.domLock = true;
                this.event.dispatchEvent(EVENT_TYPES.BEFORE_UNMOUNT);
                this.mountedProjectKey = null;
                // 非iframe，调用unmount
                const mountedProjectRegisterConfig = this.registerConfig[mountedProjectKey];
                const { unmount } = mountedProjectRegisterConfig;
                if (!unmount) {
                    console.error(`unmount of project: ${mountedProjectKey} not exist`);
                    return;
                }
                const unmountWithHook = this.withHook('unmount', unmount, { mountedProjectKey });
                // 返回promise时等待处理完成
                const unmountResult = unmountWithHook(this.mountDOM);
                let handler = Promise.resolve();
                if (unmountResult && unmountResult.then) {
                    handler = unmountResult;
                }
                handler.then(() => {
                    this.event.dispatchEvent(EVENT_TYPES.AFTER_UNMOUNT);
                    this.domLock = false;
                    this.event.dispatchEvent(EVENT_TYPES.UNLOCK_DOM);
                });
            }
        }
    };
    // 跳转
    public navigate = (url: string) => {
        this.history.push(url);
        this.syncEvent(EVENT_TYPES.PATH_CHANGE, {
            url
        });
    };
}
