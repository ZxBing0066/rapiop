import axios from 'axios';

import RAPIOP from '@rapiop/rapiop';
import DependencePlugin from '@rapiop/rapiop/lib/plugins/dependence';

function getConfig() {
    return axios.get('/config.json').then(res => res.data);
}
const dependencePlugin = new DependencePlugin({
    getDependenceMap: () => {
        return new Promise(resolve => {
            resolve({
                error: ['/error-dependence.js']
            });
        });
    },
    onError: e => {
        console.error(e);
        alert('依赖加载失败');
    },
    baseUrl: location.origin
});

const app = new RAPIOP({
    getConfig,
    plugins: [dependencePlugin],
    onError: e => {
        console.error(e);
        alert('项目文件加载失败');
    }
});

window.app = app;

app._hooks.afterMountDOM.tap('log', console.log);
console.log(app);
