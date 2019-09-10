import axios from 'axios';
import { createBrowserHistory } from 'history';
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
    history: createBrowserHistory(),
    plugins: [dependencePlugin],
    onError: e => {
        console.error(e);
        alert('项目文件加载失败');
    }
});

window.app = app;

console.log(app);
