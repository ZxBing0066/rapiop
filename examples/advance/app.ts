import _ from 'lodash';
import { createBrowserHistory } from 'history';

import RAPIOP from '@rapiop/rapiop';
import FramePlugin from '@rapiop/rapiop/lib/plugins/frame';
import IframePlugin from '@rapiop/rapiop/lib/plugins/iframe';
import DependencesPlugin from '@rapiop/rapiop/lib/plugins/dependence';
import PrefetchPlugin from '@rapiop/rapiop/lib/plugins/prefetch';
import SandboxPlugin from '@rapiop/rapiop/lib/plugins/sandbox';

import { getConfig } from './config';

export const init = (isInIframe: boolean) => {
    const history = createBrowserHistory();

    const app = RAPIOP({
        config: getConfig,
        history,
        plugins: [
            new IframePlugin(),
            new DependencesPlugin({
                getDependenceMap: () => {
                    return getConfig().then((config: any) => {
                        return config.dependenceMap;
                    });
                }
            }),
            new SandboxPlugin(),
            ...(isInIframe
                ? []
                : [
                      new PrefetchPlugin({
                          autoPrefetchProjects: ['vue-demo']
                      })
                  ])
        ]
    });

    !isInIframe &&
        _.each(app.hooks, (hook, name) => {
            hook.tap(`hook ${name} triggered`, (...args: any) => {
                console.log(`hook ${name} triggered`, ...args);
            });
        });

    app.getConfig = getConfig;
    app.history = history;
    return app;
};
