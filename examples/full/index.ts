import _ from 'lodash';
import axios from 'axios';
import { createBrowserHistory } from 'history';

import RAPIOP from '@rapiop/rapiop';
import FramePlugin from '@rapiop/rapiop/lib/plugins/frame';
import IframePlugin from '@rapiop/rapiop/lib/plugins/iframe';
import DependencesPlugin from '@rapiop/rapiop/lib/plugins/dependence';

const getConfig = (() => {
    let config: any = null;
    let loading = false;
    let queue: (() => void)[] = [];
    return () => {
        if (config) {
            return Promise.resolve(config);
        } else if (!loading) {
            loading = true;
            return axios.get('/config.json').then(res => {
                config = res.data;
                loading = false;
                queue.forEach(task => {
                    task();
                });
                return config;
            });
        } else {
            return new Promise(resolve => {
                queue.push(() => {
                    resolve(config);
                });
            });
        }
    };
})();

const history = createBrowserHistory();

const app = RAPIOP({
    getConfig,
    history,
    plugins: [
        new IframePlugin(),
        new FramePlugin(),
        new DependencesPlugin({
            getDependenceMap: () => {
                return getConfig().then(config => {
                    return config.dependenceMap;
                });
            }
        })
    ]
});

app.getConfig = getConfig;
app.history = history;

(window as any)._MY_APP = app;
