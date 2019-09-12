import _ from 'lodash';
import { SyncHook, AsyncParallelHook } from 'tapable';

import { loadResources } from './lib/load';
import { getProjectkeyFromPath } from './lib/route';
import { Config, Option, ProjectOption, RegisterConfig, ProjectRegisterConfig, Plugin } from './interface';

// 提供的钩子
class Hooks {
    // frame 注册完成后
    afterFrameRegister = new SyncHook();
    // mountDOM 提供后
    afterMountDOM = new SyncHook(['mountDOM']);
    /**
     * 项目挂载前
     * 可通过调用 project.callOrigin 拦截默认行为，传入 true 触发默认行为，传入 false 拦截默认行为
     */
    beforeMount = new AsyncParallelHook(['project']);
    // 项目挂载后
    afterMount = new SyncHook(['project']);
    // 项目卸载前
    beforeUnmount = new AsyncParallelHook(['project']);
    // 项目卸载后
    afterUnmount = new SyncHook(['project']);
    // 项目注册后
    afterRegister = new SyncHook(['project']);
    // 初始化完成
    afterInit = new SyncHook();
    // 路径变化
    pathChange = new SyncHook();
    // 报错
    error = new SyncHook(['error']);
}

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
        plugins = [],
        frameKey = 'frame',
        homeKey = 'home',
        cacheBeforeRun = true,
        getConfig,
        onError = () => {},
        debugOptions: debugOptions = {},
        history
    } = option;

    if (!getConfig) {
        console.error(`Must provide getConfig when init App`);
        return;
    }
    const registerPlugin = (plugin: Plugin) => {
        plugin.bind(this);
    };
    // 注册插件
    plugins.forEach(plugin => {
        registerPlugin(plugin);
    });

    let config: Config,
        inited = false,
        lock = false,
        queuing = false,
        frameRegistered = false,
        mountedProjectKey: string,
        mountDOM: Element;
    const registerConfig: RegisterConfig = {};

    // 更新项目
    const _refresh = async () => {
        const projectKey = getProjectkeyFromPath(location.pathname, config) || homeKey;
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
            loadResources(
                projectConfig.files || projectConfig.file,
                cacheBeforeRun && !debugOptions.devProjectKey,
                onError
            );
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

    const registerFrame = (frameMount: () => Promise<Element>) => {
        if (frameRegistered) {
            return console.error(`Cant't call registerFrame multiple times`);
        }
        frameRegistered = true;
        const mountFrame = () => {
            frameMount().then((_mountDOM: Element) => {
                mountDOM = _mountDOM;
                hooks.afterMountDOM.call(_mountDOM);
            });
        };
        hooks.afterFrameRegister.call();
        if (inited) {
            mountFrame();
        } else {
            hooks.afterInit.tap('mountFrame', mountFrame);
        }
    };

    // 获取配置信息
    getConfig()
        .then(_config => {
            config = _config;

            // 更新项目
            hooks.afterMountDOM.tap('refresh', refresh);
            hooks.afterRegister.tap('refresh', refresh);
            hooks.pathChange.tap('refresh', refresh);

            // 路由变化监听
            const historyHandler = () => {
                hooks.pathChange.call();
            };
            history.listen(() => historyHandler());
            // dispatch history change after init
            historyHandler();
            // 调试frame或iframe中时不做frame加载
            if (!frameRegistered) {
                const frameConfig = config[frameKey] || {};
                loadResources(frameConfig.files || frameConfig.file, false, onError);
            }
            hooks.afterInit.call();
        })
        .catch(e => {
            hooks.error.call(e);
        });

    return {
        register,
        registerFrame,
        registerPlugin,
        hooks
    };
};
