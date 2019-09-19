import Hooks from '../Hooks';
import { loadResources } from '../lib/load';

interface Options {
    // 提供 mountDOM 的项目 key，为 null 时视为无单独项目提供，需主动调用 registerFrame
    mountDOMProvideProjectKey?: string;
}

export default class FramePlugin {
    options: Options;
    constructor(options: Options = {}) {
        this.options = options;
    }
    call = ({ hooks, pluginDataSlot }: { hooks: Hooks; pluginDataSlot: any }) => {
        const { mountDOMProvideProjectKey = 'frame' } = this.options;
        if (pluginDataSlot.ignoreFrame) {
            return;
        }
        let mountDOMProvided = false;
        hooks.afterMountDOM.tap('FramePlugin: mount dom provided', () => {
            mountDOMProvided = true;
        });
        hooks.afterGetConfig.tap('FramePlugin: load frame', config => {
            if (mountDOMProvideProjectKey && !mountDOMProvided) {
                const frameConfig = config[mountDOMProvideProjectKey] || {};
                loadResources(frameConfig.files || frameConfig.file, false, e => hooks.error.call(e));
            }
        });
        let frameRegistered = false;
        const registerFrame = (frameMount: () => Promise<Element>) => {
            if (frameRegistered) return console.error(`Frame has been registered`);
            if (mountDOMProvided) return console.error(`MountDOM has been provided`);
            frameRegistered = true;
            const mountFrame = () => {
                frameMount().then((mountDOM: Element) => {
                    hooks.mountDOM.call(mountDOM);
                });
            };

            mountFrame();
        };

        hooks.amendInstance.tap('amend registerFrame', (instance, amendInstance) => {
            amendInstance({
                registerFrame
            });
        });
    };
}
