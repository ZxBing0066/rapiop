import { loadResources } from './lib/load';
import { getProjectkeyFromPath } from './lib/route';
import { createInterceptor } from './lib/interceptor';
import { ErrorType } from './lib/error';
import {
    Config,
    GetConfig,
    ProjectConfig,
    Option,
    ProjectOption,
    RegisterConfig,
    ProjectRegisterConfig,
    Plugin,
    OnError,
    AnyFunction
} from './interface';
import Hooks, { Hook } from './Hooks';

const asyncLifeCyleHelper = async ({
    hooks,
    projectKey,
    projectInfo,
    defaultHandler,
    onError,
    errorType
}: {
    hooks: {
        before?: Hook;
        main: Hook;
        after?: Hook;
    };
    projectKey: string;
    projectInfo: any;
    defaultHandler: AnyFunction;
    onError: OnError;
    errorType: string;
}): Promise<boolean> => {
    hooks.before && hooks.before.call(projectKey);
    const interceptor = createInterceptor();
    await hooks.main.promise(projectKey, projectInfo, {
        intercept: interceptor.intercept,
        fail: interceptor.fail
    });
    let failed = interceptor.getFailed();
    const intercepted = interceptor.getIntercepted();
    let handlerResult;
    if (!failed && !intercepted) {
        try {
            handlerResult = await defaultHandler();
        } catch (e) {
            failed = e;
        }
    }
    if (failed) {
        const error = new Error(errorType);
        console.error(error, ...(failed === true ? [] : [failed]));
        onError(error);
        return false;
    }
    hooks.after && hooks.after.call(projectKey);
    return handlerResult === false ? false : true;
};

/**
 * 挂载项目
 */
const mountProject = async ({
    projectKey,
    projectRegisterConfig,
    mountDOM,
    hooks,
    onError
}: {
    projectKey: string;
    projectRegisterConfig: ProjectRegisterConfig;
    mountDOM: Element;
    hooks: Hooks;
    onError: OnError;
}): Promise<boolean> => {
    // mountDOM 为空时，不处理
    if (!mountDOM) {
        console.info(`mountDOM didn't provided`);
        return;
    }

    // 已经 load 时，触发 mount
    const { mount } = projectRegisterConfig;
    if (!mount) {
        console.error(`mount of project: ${projectKey} not exist`);
        return;
    }

    return await asyncLifeCyleHelper({
        hooks: {
            before: hooks.beforeMount,
            main: hooks.mount,
            after: hooks.afterMount
        },
        projectKey,
        projectInfo: {},
        defaultHandler: () => mount(mountDOM),
        onError,
        errorType: ErrorType.MountFailed
    });
};

/**
 * 卸载项目
 */
const unmountProject = async ({
    projectKey,
    projectRegisterConfig,
    mountDOM,
    hooks,
    onError
}: {
    projectKey: string;
    projectRegisterConfig: ProjectRegisterConfig;
    mountDOM: Element;
    hooks: Hooks;
    onError: OnError;
}): Promise<boolean> => {
    const { unmount } = projectRegisterConfig;
    if (!unmount) {
        console.error(`unmount of project: ${projectKey} not exist`);
        return;
    }

    return await asyncLifeCyleHelper({
        hooks: {
            before: hooks.beforeUnmount,
            main: hooks.unmount,
            after: hooks.afterUnmount
        },
        projectKey,
        projectInfo: {},
        defaultHandler: () => unmount(mountDOM),
        onError,
        errorType: ErrorType.MountFailed
    });
};

const loadProjectResources = async ({
    projectKey,
    files,
    projectConfig,
    cacheBeforeRun,
    hooks,
    onError
}: {
    projectKey: string;
    files: string[];
    projectConfig: ProjectConfig;
    cacheBeforeRun: boolean;
    hooks: Hooks;
    onError: OnError;
}) => {
    if (!files) {
        console.warn(`project ${projectKey} has no file`);
        return false;
    }

    return await asyncLifeCyleHelper({
        hooks: {
            main: hooks.loadResources
        },
        projectKey,
        projectInfo: {
            files,
            projectConfig,
            cacheBeforeRun
        },
        defaultHandler: () => loadResources(files, cacheBeforeRun, onError),
        onError,
        errorType: ErrorType.LoadResourceFailed
    });
};

/**
 * 进入项目
 */
const enterProject = async ({
    projectKey,
    projectRegisterConfig,
    projectConfig,
    mountDOM,
    hooks,
    onError,
    cacheBeforeRun
}: {
    projectKey: string;
    projectRegisterConfig: ProjectRegisterConfig;
    projectConfig: ProjectConfig;
    mountDOM: Element;
    hooks: Hooks;
    onError: OnError;
    cacheBeforeRun: boolean;
}): Promise<boolean> => {
    return await asyncLifeCyleHelper({
        hooks: {
            main: hooks.enter
        },
        projectKey,
        projectInfo: {},
        defaultHandler: async () => {
            // 无配置项认定为项目未加载
            if (!projectRegisterConfig) {
                const files = projectConfig.files;
                loadProjectResources({
                    projectKey,
                    files,
                    projectConfig,
                    cacheBeforeRun,
                    hooks,
                    onError
                });
                return false;
            }
            // 挂载项目
            return !!(await mountProject({
                projectKey,
                projectRegisterConfig,
                mountDOM,
                hooks,
                onError
            }));
        },
        onError,
        errorType: ErrorType.EnterFailed
    });
};
/**
 * 退出项目
 */
const exitProject = async ({
    projectKey,
    projectRegisterConfig,
    mountDOM,
    hooks,
    onError
}: {
    projectKey: string;
    projectRegisterConfig: ProjectRegisterConfig;
    mountDOM: Element;
    hooks: Hooks;
    onError: OnError;
}): Promise<boolean> => {
    if (projectKey) {
        return await asyncLifeCyleHelper({
            hooks: {
                main: hooks.exit
            },
            projectKey,
            projectInfo: {},
            defaultHandler: () =>
                unmountProject({
                    projectKey,
                    projectRegisterConfig,
                    mountDOM,
                    hooks,
                    onError
                }),
            onError,
            errorType: ErrorType.ExitFailed
        });
    }
};

/**
 * 创建实例
 * @param option 实例参数
 * @return instance 实例
 * @return instance.register 注册一个项目
 * @return instance.registerPlugin 注册插件
 * @return instance.hooks 钩子
 */
const rapiop = (option: Option) => {
    const hooks = new Hooks();
    const {
        // 插件目录
        plugins = [],
        // 无匹配项目时的默认项目
        fallbackProjectKey = 'home',
        // 加载 js 代码时优先缓存文件，然后执行，减少串行等待时间
        cacheBeforeRun = true,
        // 自定义 history 对象
        history,
        // 项目挂载节点
        mountDOM: initedMountDOM,
        // 错误时的回调
        onError = () => {}
    } = option;
    let {
        // 项目路由配置信息，支持函数和 Promise
        config
    } = option;

    if (!config) {
        console.error(`Must provide config when init App`);
        return;
    }

    let _config: Config,
        lock = false,
        queuing = false,
        mountedProjectKey: string,
        mountDOM: Element;
    const registerConfig: RegisterConfig = {};

    // 更新项目
    const _refresh = async () => {
        if (!_config) {
            console.info(`Config is not provided`);
            return;
        }
        const projectKey = getProjectkeyFromPath(location.pathname, _config) || fallbackProjectKey;
        // 匹配的项目未改变，不处理
        if (mountedProjectKey === projectKey) {
            console.info(`Project ${projectKey} was mounted`);
            return;
        }
        // 卸载现有项目
        if (
            await exitProject({
                projectKey: mountedProjectKey,
                projectRegisterConfig: registerConfig[mountedProjectKey],
                mountDOM,
                hooks,
                onError
            })
        ) {
            mountedProjectKey = null;
        }
        if (
            await enterProject({
                projectKey,
                projectConfig: _config[projectKey],
                projectRegisterConfig: registerConfig[projectKey],
                mountDOM,
                hooks,
                onError,
                cacheBeforeRun
            })
        ) {
            mountedProjectKey = projectKey;
        }
    };

    const refresh = async () => {
        if (lock) {
            queuing = true;
            return;
        }
        lock = true;
        await _refresh();
        lock = false;
        if (queuing) {
            queuing = false;
            refresh();
        }
    };

    const register = (
        projectKey: string,
        mount: (mountDOM: Element) => void,
        unmount: () => void,
        option: ProjectOption
    ) => {
        if (registerConfig[projectKey]) {
            return console.error(`Project: ${projectKey} was registered`);
        }
        registerConfig[projectKey] = {
            mount,
            unmount,
            option
        };
        hooks.afterRegister.call(projectKey);
    };

    // hooks tap
    // 提供 mountDOM
    hooks.mountDOM.tap('provide mount dom', (dom: Element) => {
        if (mountDOM) return console.error("Can't set mountDOM repeatly");
        mountDOM = dom;
        // trigger afterMountDOM hook
        setTimeout(() => {
            hooks.afterMountDOM.call(mountDOM);
        });
    });
    // 初始化提供过 mountDOM 时，使用初始化的 mountDOM
    if (initedMountDOM) {
        hooks.mountDOM.call(initedMountDOM);
    }

    // 触发 refresh、mountDOM 提供、项目注册、配置获取完成、hostory 更新时 更新项目
    if (history) {
        history.listen(refresh);
    }
    hooks.refresh.tap('refresh', refresh);
    hooks.afterConfig.tap('refresh afterConfig', refresh);
    hooks.afterMountDOM.tap('refresh afterMountDOM', refresh);
    hooks.afterRegister.tap('refresh afterRegister', refresh);

    // 注册插件
    const registerPlugin = (plugin: Plugin) => {
        plugin.call({ hooks });
    };
    plugins.forEach(plugin => registerPlugin(plugin));

    type RegisterArgs = Parameters<typeof register>;
    type registerPluginArgs = Parameters<typeof registerPlugin>;
    interface Instance {
        register: (...args: RegisterArgs) => void;
        registerPlugin: (...args: registerPluginArgs) => void;
        hooks: Hooks;
        [key: string]: any;
    }
    // 返回的实例
    let instance: Instance = {
        register,
        registerPlugin,
        hooks
    };
    // 挂载插件提供的实例属性
    const amendInstance = (amendProps: Instance) => Object.assign(instance, amendProps);
    hooks.amendInstance.call(instance, amendInstance);

    try {
        (async () => {
            if (!config) {
                console.error(`Must provide a config`);
            } else if (typeof config === 'function') {
                _config = await (config as GetConfig)();
            } else {
                _config = config;
            }
            hooks.afterConfig.call(_config, instance);
        })();
    } catch (e) {
        hooks.error.call(e);
        console.error(e);
    }

    return instance;
};
export default rapiop;
