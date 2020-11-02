import SyncHook from '../tapable/SyncHook';

import Hooks from '../Hooks';
import getType from '../lib/getType';

const isInIframe = window.self !== window.parent;

type Options = {
    // 缓存的 iframe 项目上限
    cachedLimit?: number;
    // 不清空历史 iframe 的内存上限
    memoryLimit?: number;
};

const createMountDOM = () => {
    const mountDOM = document.createElement('div');
    mountDOM.style.width = '100%';
    mountDOM.style.height = '100%';
    mountDOM.style.overflow = 'auto';
    document.body.appendChild(mountDOM);
    return mountDOM;
};

const createIframeDOM = (projectKey: string) => {
    const iframeDOM = document.createElement('iframe');
    iframeDOM.frameBorder = '0';
    iframeDOM.width = '100%';
    iframeDOM.height = '100%';
    iframeDOM.style.display = 'block';
    iframeDOM.src = location.href;
    iframeDOM.setAttribute(`data-rapiop-project-${projectKey}`, '');
    return iframeDOM;
};

const RAPIOP_ROUTE_SYNC_EVENT = 'RAPIOP_ROUTE_SYNC';
const RAPIOP_PROJECT_AFTER_MOUNT_EVENT = 'RAPIOP_PROJECT_AFTER_MOUNT';
const RAPIOP_PROJECT_BACKGROUND_EVENT = 'RAPIOP_PROJECT_BACKGROUND';
const RAPIOP_PROJECT_FOREGROUND_EVENT = 'RAPIOP_PROJECT_FOREGROUND';

const RAPIOP_IFRAME_STATUS_CREATA = 'RAPIOP_IFRAME_STATUS_CREATE';
const RAPIOP_IFRAME_STATUS_AFTER_MOUNT = 'RAPIOP_IFRAME_STATUS_AFTER_MOUNT';
const RAPIOP_IFRAME_STATUS_BACKGROUND = 'RAPIOP_IFRAME_STATUS_BACKGROUND';
const RAPIOP_IFRAME_STATUS_FOREGROUND = 'RAPIOP_IFRAME_STATUS_FOREGROUND';

export const IFRAME_STATUS = {
    create: RAPIOP_IFRAME_STATUS_CREATA,
    afterMount: RAPIOP_IFRAME_STATUS_AFTER_MOUNT,
    background: RAPIOP_IFRAME_STATUS_BACKGROUND,
    foreground: RAPIOP_IFRAME_STATUS_FOREGROUND
};

export default class Iframe {
    options: Options;
    constructor(options: Options = {}) {
        this.options = options;
    }

    call({ hooks }: { hooks: Hooks }) {
        if (isInIframe) {
            // Sync route info to parent window
            const syncRoute = () =>
                window.parent.postMessage(
                    {
                        type: RAPIOP_ROUTE_SYNC_EVENT,
                        href: location.href
                    },
                    location.origin
                );
            // amend syncRoute function to instance
            hooks.amendInstance.tap('amend syncRoute', (instance, amendInstance) => {
                amendInstance({
                    syncRoute
                });
            });
            hooks.afterMount.tap('mount end', (projectKey: string) => {
                window.parent.postMessage(
                    {
                        type: RAPIOP_PROJECT_AFTER_MOUNT_EVENT,
                        projectKey
                    },
                    location.origin
                );
            });
            const mountDOM = createMountDOM();
            hooks.mountDOM.call(mountDOM);
            window.addEventListener('message', event => {
                if (event.origin === location.origin && event.data) {
                    switch (event.data.type) {
                        case RAPIOP_PROJECT_FOREGROUND_EVENT:
                            syncRoute();
                            break;
                    }
                }
            });
        } else {
            const iframeStatusChange = new SyncHook(['projectKey', 'status']);
            let iframeMountDOM: HTMLElement = null;
            const supportMemoryOptimization = (window.performance as any)?.memory?.usedJSHeapSize;
            const { cachedLimit = 20, memoryLimit = 1024 * 1024 * 1024 } = this.options;
            let cachedQueue: {
                key: string;
                destroy: () => void;
            }[] = [];
            window.addEventListener('message', event => {
                if (event.origin === location.origin && event.data) {
                    switch (event.data.type) {
                        case RAPIOP_ROUTE_SYNC_EVENT:
                            history.replaceState(null, null, event.data.href);
                            break;
                        case RAPIOP_PROJECT_AFTER_MOUNT_EVENT:
                            iframeStatusChange.call(event.data.projectKey, IFRAME_STATUS.afterMount);
                            break;
                    }
                }
            });
            hooks.amendInstance.tap('amend registerIframeMountDOM', (instance, amendInstance) => {
                amendInstance({
                    registerIframeMountDOM: (dom: HTMLElement) => (iframeMountDOM = dom)
                });
            });
            hooks.amendHooks.tap('amend iframe status change hook', (hooks, amendHooks) => {
                amendHooks({
                    iframeStatusChange
                });
            });
            hooks.beforeMount.tap('clean iframe', (projectKey: string) => {
                cachedQueue = cachedQueue.filter(({ key }) => key !== projectKey);
                if (cachedQueue.length > cachedLimit) {
                    cachedQueue.shift().destroy();
                }
                if (supportMemoryOptimization && cachedQueue.length) {
                    const usedJSHeapSize = (window.performance as any).memory.usedJSHeapSize;
                    if (usedJSHeapSize > memoryLimit) {
                        cachedQueue.shift().destroy();
                    }
                }
            });
            hooks.afterConfig.tap('init iframe', (config, rapiop) => {
                const keys = Object.keys(config);
                keys.forEach(projectKey => {
                    const projectConfig = config[projectKey];
                    const { mode } = projectConfig;
                    let isIframeMode,
                        isIframeModeCache = false;
                    if (getType(mode) === 'Object') {
                        isIframeMode = mode.mode === 'iframe';
                        isIframeModeCache = mode.cache;
                    } else {
                        isIframeMode = mode === 'iframe';
                    }
                    let cachedIframe: HTMLIFrameElement = null;
                    if (isIframeMode) {
                        let iframeDOM: HTMLIFrameElement = null;
                        rapiop.register(
                            projectKey,
                            (mountDOM: HTMLElement) => {
                                if (iframeMountDOM) {
                                    mountDOM.style.display = 'none';
                                    iframeMountDOM.style.display = 'block';
                                }
                                if (iframeMountDOM && cachedIframe) {
                                    cachedIframe.style.display = 'block';
                                    cachedIframe.contentWindow.postMessage(
                                        { type: RAPIOP_PROJECT_FOREGROUND_EVENT },
                                        location.origin
                                    );
                                    iframeStatusChange.call(projectKey, IFRAME_STATUS.foreground);
                                } else {
                                    iframeDOM = createIframeDOM(projectKey);
                                    (iframeMountDOM || mountDOM).appendChild(iframeDOM);
                                    setTimeout(() => iframeStatusChange.call(projectKey, IFRAME_STATUS.create));
                                }
                            },
                            (mountDOM: HTMLElement) => {
                                if (iframeMountDOM) {
                                    mountDOM.style.display = 'block';
                                    iframeMountDOM.style.display = 'none';
                                }
                                if (isIframeModeCache && iframeMountDOM) {
                                    iframeDOM.style.display = 'none';
                                    cachedIframe = iframeDOM;
                                    cachedQueue.push({
                                        key: projectKey,
                                        destroy: () => {
                                            (iframeMountDOM || mountDOM).removeChild(iframeDOM);
                                            iframeDOM = cachedIframe = null;
                                        }
                                    });
                                    cachedIframe.contentWindow.postMessage(
                                        { type: RAPIOP_PROJECT_BACKGROUND_EVENT },
                                        location.origin
                                    );
                                    iframeStatusChange.call(projectKey, IFRAME_STATUS.background);
                                } else {
                                    (iframeMountDOM || mountDOM).removeChild(iframeDOM);
                                    iframeDOM = null;
                                }
                            }
                        );
                    }
                });
            });
        }
    }
}
