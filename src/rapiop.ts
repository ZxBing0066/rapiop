import _ from 'lodash';

import { loadResources } from './lib/load';
import { getProjectkeyFromPath } from './lib/route';
import { Config, Option, ProjectOption, RegisterConfig, ProjectRegisterConfig, Plugin } from './interface';
import Hooks from './Hooks';

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
}) => {
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

    // callOrigin 被拦截调用过后防止重复调用
    const callOrigin = _.once((needMount = true) => (needMount ? mount(mountDOM) : null));
    // trigger beforeMount hook
    await hooks.beforeMount.promise({
        projectKey,
        projectRegisterConfig,
        mountDOM,
        callOrigin
    });
    // 防止 callOrigin 没被调用
    await callOrigin();

    // trigger afterMount hook
    hooks.afterMount.call({
        projectKey,
        projectRegisterConfig
    });
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
}) => {
    const { unmount } = projectRegisterConfig;
    if (!unmount) {
        console.error(`unmount of project: ${projectKey} not exist`);
        return;
    }
    // callOrigin 被拦截调用过后防止重复调用
    const callOrigin = _.once((needMount = true) => (needMount ? unmount(mountDOM) : null));
    // trigger beforeUnmount hook
    await hooks.beforeUnmount.promise({
        projectKey,
        projectRegisterConfig,
        mountDOM,
        callOrigin
    });
    // 防止 callOrigin 没被调用
    await callOrigin();
    // trigger afterUnmount hook
    hooks.afterUnmount.call();
    return true;
};

export default (option: Option) => {
    const hooks = new Hooks();

    const {
        // 插件目录
        plugins = [],
        // 无匹配项目时的默认项目
        fallbackProjectKey = 'home',
        // 加载 js 代码时优先缓存文件，然后执行，减少串行等待时间
        cacheBeforeRun = true,
        //
        getConfig,
        history,
        // 项目挂载节点
        mountDOM: initedMountDOM,
        onError = () => {}
    } = option;

    if (!getConfig) {
        console.error(`Must provide getConfig when init App`);
        return;
    }
    const registerPlugin = (plugin: Plugin) => {
        plugin.call({ hooks });
    };

    // 注册插件
    plugins.forEach(plugin => {
        registerPlugin(plugin);
    });

    let config: Config,
        lock = false,
        queuing = false,
        mountedProjectKey: string,
        mountDOM: Element;
    const registerConfig: RegisterConfig = {};

    // 更新项目
    const _refresh = async () => {
        const projectKey = getProjectkeyFromPath(location.pathname, config) || fallbackProjectKey;
        // 匹配的项目未改变，不处理
        if (mountedProjectKey === projectKey) {
            console.info(`Project ${projectKey} was mounted`);
            return;
        }
        // 卸载现有项目
        if (mountedProjectKey) {
            await unmountProject({
                projectKey: mountedProjectKey,
                projectRegisterConfig: registerConfig[mountedProjectKey],
                mountDOM,
                hooks
            });
            mountedProjectKey = null;
        }
        const projectRegisterConfig = registerConfig[projectKey];
        // 无配置项认定为项目未加载
        if (!projectRegisterConfig) {
            const projectConfig = config[projectKey] || {};
            if (_.isEmpty(projectConfig.files || projectConfig.file)) {
                console.warn(`project ${projectKey} has no file`);
                return;
            }
            // 拉取项目文件
            loadResources(projectConfig.files || projectConfig.file, cacheBeforeRun, onError);
            return;
        }
        if (
            // 挂载项目
            await mountProject({
                projectKey,
                projectRegisterConfig,
                mountDOM,
                hooks
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
    history.listen(refresh);
    hooks.refresh.tap('refresh', refresh);
    hooks.afterGetConfig.tap('refresh afterGetConfig', refresh);
    hooks.afterMountDOM.tap('refresh afterMountDOM', refresh);
    hooks.afterRegister.tap('refresh afterRegister', refresh);

    try {
        (async () => {
            // 获取配置信息
            config = await getConfig();
            hooks.afterGetConfig.call(config);
        })();
    } catch (e) {
        hooks.error.call(e);
        console.error(e);
    }

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
    const amendInstance = (amendProps: Instance) =>
        (instance = {
            ...instance,
            ...amendProps
        });
    hooks.amendInstance.call(instance, amendInstance);
    return instance;
};
