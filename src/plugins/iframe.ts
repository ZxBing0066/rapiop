import Hooks from '../Hooks';
import getType from '../lib/getType';

const isInIframe = window.self !== window.top;

type Options = {};

const createMountDOM = () => {
    const mountDOM = document.createElement('div');
    mountDOM.style.width = '100%';
    mountDOM.style.height = '100%';
    mountDOM.style.overflow = 'auto';
    document.body.appendChild(mountDOM);
    return mountDOM;
};

const createIframeDOM = () => {
    const iframeDOM = document.createElement('iframe');
    iframeDOM.frameBorder = '0';
    iframeDOM.width = '100%';
    iframeDOM.height = '100%';
    iframeDOM.style.display = 'block';
    iframeDOM.src = location.href;
    return iframeDOM;
};

const RAPIOP_ROUTE_SYNC_EVENT = 'RAPIOP_ROUTE_SYNC';

export default class Iframe {
    options: Options;
    constructor(options: Options) {
        this.options = options;
    }

    call({ hooks }: { hooks: Hooks }) {
        let iframeMountDOM: HTMLElement = null;
        if (isInIframe) {
            hooks.amendInstance.tap('amend syncRoute', (instance, amendInstance) => {
                amendInstance({
                    syncRoute: () =>
                        window.top.postMessage(
                            {
                                type: RAPIOP_ROUTE_SYNC_EVENT,
                                href: location.href
                            },
                            location.origin
                        )
                });
            });
            const mountDOM = createMountDOM();
            hooks.mountDOM.call(mountDOM);
        } else {
            window.addEventListener('message', event => {
                if (event.origin === location.origin && event.data && event.data.type === RAPIOP_ROUTE_SYNC_EVENT) {
                    history.replaceState(null, null, event.data.href);
                }
            });
            hooks.amendInstance.tap('amend registerIframeMountDOM', (instance, amendInstance) => {
                amendInstance({
                    registerIframeMountDOM: (dom: HTMLElement) => (iframeMountDOM = dom)
                });
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
                                } else {
                                    iframeDOM = createIframeDOM();
                                    (iframeMountDOM || mountDOM).appendChild(iframeDOM);
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
