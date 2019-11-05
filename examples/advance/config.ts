import axios from 'axios';

export const getConfig = (() => {
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
