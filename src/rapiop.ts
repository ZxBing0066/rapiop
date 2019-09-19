import { loadResources } from './lib/load';
import { getProjectkeyFromPath } from './lib/route';
import {
    Config,
    ProjectConfig,
    Option,
    ProjectOption,
    RegisterConfig,
    ProjectRegisterConfig,
    Plugin,
    OnError
} from './interface';
import Hooks from './Hooks';

const createInterceptor = () => {
    let intercepted = false;
    let failed = false;
    // 调用后拦截默认行为
    const intercept = () => (intercepted = true);
    // 调用后认定进入项目失败
    const fail = () => (failed = true);
    return {
        intercept,
        fail,
        getIntercepted: () => intercepted,
        getFailed: () => failed
    };
};

/**
 * 挂载项目
 */
const mountProject = async ({
    projectKey,
    projectRegisterConfig,
    mountDOM,
    hooks
}: {
    projectKey: string;
    projectRegisterConfig: ProjectRegisterConfig;
    mountDOM: Element;
    hooks: Hooks;
}): Promise<boolean> => {
    // mountDOM 为空时, frame 还未加载或初始化未完成，不处理
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

    const interceptor = createInterceptor();
    await hooks.mount.promise({
        projectKey,
        projectRegisterConfig,
        mountDOM,
        intercept: interceptor.intercept,
        fail: interceptor.fail
    });
    const failed = interceptor.getFailed();
    const intercepted = interceptor.getIntercepted();
    if (failed) return false;
    if (!intercepted) {
        await mount(mountDOM);
    }
    return true;
};

/**
 * 卸载项目
 */
const unmountProject = async ({
    projectKey,
    projectRegisterConfig,
    mountDOM,
    hooks
}: {
    projectKey: string;
    projectRegisterConfig: ProjectRegisterConfig;
    mountDOM: Element;
    hooks: Hooks;
}): Promise<boolean> => {
    const { unmount } = projectRegisterConfig;
    if (!unmount) {
        console.error(`unmount of project: ${projectKey} not exist`);
        return;
    }

    const interceptor = createInterceptor();
    await hooks.unmount.promise({
        projectKey,
        projectRegisterConfig,
        mountDOM,
        intercept: interceptor.intercept,
        fail: interceptor.fail
    });
    const failed = interceptor.getFailed();
    const intercepted = interceptor.getIntercepted();
    if (failed) return false;
    if (!intercepted) {
        await unmount(mountDOM);
    }
    return true;
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
    const enter = async () => {
        // 无配置项认定为项目未加载
        if (!projectRegisterConfig) {
            const files = projectConfig.files || projectConfig.file;
            if (!files) {
                console.warn(`project ${projectKey} has no file`);
                return;
            }
            // 拉取项目文件
            loadResources(files, cacheBeforeRun, onError);
            return;
        }

        // 挂载项目
        return await mountProject({
            projectKey,
            projectRegisterConfig,
            mountDOM,
            hooks
        });
    };
    const interceptor = createInterceptor();
    await hooks.enterProject.promise({
        intercept: interceptor.intercept,
        fail: interceptor.fail
    });
    const failed = interceptor.getFailed();
    const intercepted = interceptor.getIntercepted();
    if (failed) return false;
    if (!intercepted) {
        return await enter();
    }
    return true;
};
/**
 * 退出项目
 */
const exitProject = async ({
    projectKey,
    projectRegisterConfig,
    mountDOM,
    hooks
}: {
    projectKey: string;
    projectRegisterConfig: ProjectRegisterConfig;
    mountDOM: Element;
    hooks: Hooks;
}): Promise<boolean> => {
    if (projectKey) {
        const interceptor = createInterceptor();
        await hooks.exitProject.promise({
            intercept: interceptor.intercept,
            fail: interceptor.fail
        });
        const failed = interceptor.getFailed();
        const intercepted = interceptor.getIntercepted();
        if (failed) return false;
        if (!intercepted) {
            return await unmountProject({
                projectKey,
                projectRegisterConfig,
                mountDOM,
                hooks
            });
        }
        return true;
    }
};

/**
 * 创建实例
 * @param option 实例参数
 * @return instance 实例属性
 * @return instance.register 注册一个项目
 * @return instance.registerPlugin 注册插件
 * @return hooks 钩子
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
        // 获取项目路由配置信息
        getConfig,
        // 自定义 history 对象
        history,
        // 项目挂载节点
        mountDOM: initedMountDOM,
        // 错误时的回调
        onError = () => {}
    } = option;

    if (!getConfig) {
        console.error(`Must provide getConfig when init App`);
        return;
    }

    let config: Config,
        lock = false,
        queuing = false,
        mountedProjectKey: string,
        mountDOM: Element;
    const registerConfig: RegisterConfig = {};

    // 更新项目
    const _refresh = async () => {
        if (!config) {
            console.info(`Config is not provided`);
            return;
        }
        const projectKey = getProjectkeyFromPath(location.pathname, config) || fallbackProjectKey;
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
                hooks
            })
        ) {
            mountedProjectKey = null;
        }
        if (
            await enterProject({
                projectKey,
                projectConfig: config[projectKey],
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
        mountDOM = dom;
        // trigger afterMountDOM hook
        hooks.afterMountDOM.call(mountDOM);
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
    hooks.afterGetConfig.tap('refresh afterGetConfig', refresh);
    hooks.afterMountDOM.tap('refresh afterMountDOM', refresh);
    hooks.afterRegister.tap('refresh afterRegister', refresh);

    // 注册插件
    let pluginDataSlot = {};
    const amendPluginDataSlot = (data: any) => {
        pluginDataSlot = Object.assign(pluginDataSlot, data);
    };
    const registerPlugin = (plugin: Plugin) => {
        plugin.call({ hooks, pluginDataSlot, amendPluginDataSlot });
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
            // 获取配置信息
            config = await getConfig();
            hooks.afterGetConfig.call(config, instance);
        })();
    } catch (e) {
        hooks.error.call(e);
        console.error(e);
    }

    return instance;
};
export default rapiop;
