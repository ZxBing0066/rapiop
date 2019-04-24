import { createBrowserHistory } from 'history';
import _ from 'lodash';

import { loadResources } from './lib/load';
import { Event, EVENT_TYPES } from './lib/event';
import { getProjectkeyFromPath } from './lib/route';
import { Config, Option, ProjectOption, RegisterConfig, Plugin, DebugOptions } from './interface';

const isInIframe = window.self !== window.top;

const MESSAGE_TYPE = 'RAPIOP_MESSAGE';

export default class App {
    // 事件器
    public event: Event = new Event();
    // service 列表
    services: any = {};
    // 根节点, for frame mount
    rootDOM: Element;
    // frame输出的节点, for project mount
    mountDOM: Element;
    // iframe模式的iframe容器
    iframeDOM: Element;
    // 首页的项目key
    homeKey: string;
    // history对象
    history: any = createBrowserHistory();
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
    // 所有事件，方便外部获取
    public EVENT_TYPES = EVENT_TYPES;
    // frame是否已注册
    frameRegistered: boolean = false;
    // 调试用参数
    debugOptions: DebugOptions;
    constructor(option: Option) {
        this.init(option);
    }
    // 项目初始化
    init = async (option: Option) => {
        this.event.dispatchEvent(EVENT_TYPES.BEFORE_INIT);

        const { plugins = [], services = [], frameKey = 'frame', homeKey = 'home', getConfig, debug = {} } = option;
        if (!getConfig) {
            console.error(`Must provide getConfig when init App`);
            return;
        }
        this.debugOptions = debug;
        // 无匹配的项目匹配到home
        this.homeKey = homeKey;
        // 注册插件
        plugins.forEach(plugin => {
            this.registerPlugin(plugin);
        });
        // 注册服务
        services.forEach(service => {
            this.registerService(service);
        });
        if (isInIframe) {
            this.initIframe();
        } else {
            this.initParent();
        }
        // 获取配置信息
        this.config = await getConfig();

        // 事件监听
        this.event.addEventListener(EVENT_TYPES.PATH_CHANGE, this.refresh);
        this.event.addEventListener(EVENT_TYPES.AFTER_FRAME_REGISTERED, this.refresh);
        this.event.addEventListener(EVENT_TYPES.AFTER_PROJECT_REGISTERED, this.refresh);
        this.event.addEventListener(EVENT_TYPES.UNLOCK_DOM, () => {
            if (this.waiting) {
                this.waiting = false;
                this.refresh();
            }
        });

        // 路由变化监听
        const historyHandler = (sync: boolean = true) => {
            if (sync) {
                this.dispatchAndSyncEvent(EVENT_TYPES.PATH_CHANGE, {
                    url: location.href.replace(new RegExp(`^${location.origin}`), '')
                });
            } else {
                this.event.dispatchEvent(EVENT_TYPES.PATH_CHANGE);
            }
        };
        this.history.listen(() => historyHandler(true));
        // dispatch history change after init
        historyHandler(false);
        // 调试frame或iframe中时不做frame加载
        if (this.debugOptions.devProjectKey !== frameKey && !isInIframe && !this.frameRegistered) {
            const frameConfig = this.config[frameKey] || {};
            loadResources(frameConfig.file);
        }
        this.event.dispatchEvent(EVENT_TYPES.AFTER_INIT);
        this.inited = true;
    };
    initParent = () => {
        const rootDOM = document.createElement('div');
        rootDOM.style.height = '100%';
        document.body.appendChild(rootDOM);
        this.rootDOM = rootDOM;

        // 监听来自iframe的事件同步信息
        window.addEventListener('message', e => {
            if (e.data && e.data.type === MESSAGE_TYPE) {
                const { eventType, info } = e.data;
                switch (eventType) {
                    case EVENT_TYPES.AFTER_PROJECT_REGISTERED:
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
    // 服务注册
    registerService = (service: object) => {
        service && _.extend(this.services, service);
    };
    registryFrame = (...args: any[]) => {
        console.warn('Please use registerFrame to instead of registryFrame');
        // @ts-ignore
        this.registerFrame(...args);
    };
    // 注册ui架子
    public registerFrame = (frameMount: (rootDOM: Element) => Promise<Element>) => {
        if (isInIframe) {
            return console.warn("Can't call registerFrame in iframe");
        }
        if (this.frameRegistered) {
            return console.error(`Cant't call registerFrame multiple times`);
        }
        this.frameRegistered = true;

        if (this.inited) {
        } else {
            this.event.addEventListener(EVENT_TYPES.AFTER_INIT, () => {
                frameMount(this.rootDOM).then((mountDOM: Element) => {
                    this.mountDOM = mountDOM;
                    this.event.dispatchEvent(EVENT_TYPES.AFTER_FRAME_REGISTERED);
                });
            });
        }
    };
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
        this.dispatchAndSyncEvent(EVENT_TYPES.AFTER_PROJECT_REGISTERED);
    };
    // 刷新
    refresh = async () => {
        if (this.domLock) {
            this.waiting = true;
        } else {
            this._mount();
        }
    };
    private _mount = async () => {
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
        await this.unmount();

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
                if (_.isEmpty(projectConfig.file)) {
                    console.warn(`project ${projectKey} has no file`);
                    return;
                }
                if (this.debugOptions.devProjectKey === projectKey) {
                    console.warn(`debug project ${projectKey} without load file`);
                    return;
                }
                loadResources(projectConfig.file, !this.debugOptions.devProjectKey);
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

            // 返回promise时等待处理完成
            const mountResult = mount(this.mountDOM);
            if (mountResult && mountResult.then) {
                await mountResult;
            }

            this.dispatchAndSyncEvent(EVENT_TYPES.AFTER_MOUNT);
            this.domLock = false;
            this.event.dispatchEvent(EVENT_TYPES.UNLOCK_DOM);
        }
    };
    private unmount = async () => {
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
                // 返回promise时，等待处理完成
                const unmountResult = unmount(this.mountDOM);
                if (unmountResult && unmountResult.then) {
                    await unmountResult;
                }
                this.event.dispatchEvent(EVENT_TYPES.AFTER_UNMOUNT);
                this.domLock = false;
                this.event.dispatchEvent(EVENT_TYPES.UNLOCK_DOM);
            }
        }
    };
    // 跳转
    public navigate = (url: string) => {
        this.history.push(url);
    };
}
