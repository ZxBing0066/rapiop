import axios from 'axios';

import RAPIOP from '@rapiop/rapiop';

function getConfig() {
    return axios.get('/config.json').then(res => res.data);
}

const app = new RAPIOP({
    getConfig: getConfig
});

window.app = app;

console.log(app);
