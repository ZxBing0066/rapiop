import Hooks from '../Hooks';

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

export default class Iframe {
    options: Options;
    constructor(options: Options) {
        this.options = options;
    }

    call({ hooks, amendPluginDataSlot }: { hooks: Hooks; amendPluginDataSlot: any }) {
        if (isInIframe) {
            amendPluginDataSlot({ ignoreFrame: true });
            const mountDOM = createMountDOM();
            hooks.mountDOM.call(mountDOM);
        } else {
            hooks.afterGetConfig.tap('init iframe', (config, rapiop) => {
                const keys = Object.keys(config);
                keys.forEach(projectKey => {
                    const projectConfig = config[projectKey];
                    const { mode } = projectConfig;
                    if (mode === 'iframe') {
                        let iframeDOM: HTMLIFrameElement = null;
                        rapiop.register(
                            projectKey,
                            (mountDOM: Element) => {
                                iframeDOM = createIframeDOM();
                                mountDOM.appendChild(iframeDOM);
                            },
                            (mountDOM: Element) => {
                                iframeDOM && mountDOM.removeChild(iframeDOM);
                                iframeDOM = null;
                            }
                        );
                    }
                });
            });
        }
    }
}
