import $script from '@rapiop/scriptjs';
/**
 * 加载并执行文件
 * @param path {string}
 * @param params {Object}
 * @returns promise
 */
const fileCacheMap: {
    [src: string]: 0 | XMLHttpRequest;
} = {};

const queueMap: { [key: string]: ((res: XMLHttpRequest) => void)[] } = {};

const get = (src: string) => {
    return new Promise((resolve, reject) => {
        var oReq = new XMLHttpRequest();
        oReq.addEventListener('load', res => {
            resolve(oReq);
        });
        oReq.addEventListener('abort', e => {
            reject(e);
        });
        oReq.addEventListener('error', e => {
            reject(e);
        });
        oReq.addEventListener('timeout', e => {
            reject(e);
        });
        oReq.open('GET', src);
        oReq.send();
    });
};

export const cacheScript = (src: string) => {
    // start cache
    if (fileCacheMap[src] === 0) {
        queueMap[src] = queueMap[src] || [];
        return new Promise(resolve => {
            queueMap[src].push(resolve);
        });
    }
    if (fileCacheMap[src]) {
        return Promise.resolve(fileCacheMap[src]);
    }
    fileCacheMap[src] = 0;
    return get(src).then((res: XMLHttpRequest) => {
        // cache success
        fileCacheMap[src] = res;
        if (queueMap[src]) {
            queueMap[src].forEach(handler => {
                handler(res);
            });
            delete queueMap[src];
        }
        return res;
    });
};

export const loadScript = (src: string) => {
    return new Promise((resolve, reject) => {
        $script(src, e => {
            if (e && e.type === 'error') {
                reject(e);
            } else {
                resolve();
            }
        });
    });
};

export const loadStyle = (href: string) => {
    const el = document.createElement('link');
    el.type = 'text/css';
    el.rel = 'stylesheet';
    el.href = href;
    const head = document.head || document.getElementsByTagName('head')[0];
    head.appendChild(el);
};

export const loadResources = (files: string[], cacheFirst?: boolean, onError?: (e: Error) => void) => {
    if (!files || !files.length) return;
    const { js, css, unknown } = classifyFiles(files);
    const loadScripts = (i: number): Promise<void> => {
        return loadScript(js[i]).then(() => ++i < js.length && loadScripts(i));
    };
    // load all file in cache to speed up async load
    if (cacheFirst && js.length > 1) {
        const cacheScripts = () => {
            const promises = js.slice(1).map(script => cacheScript(script));
            return Promise.all(promises);
        };
        Promise.all([loadScript(js[0]), cacheScripts()])
            .then(() => loadScripts(0))
            .catch(onError);
    } else {
        loadScripts(0).catch(onError);
    }
    const loadStyles = () => {
        css.forEach(style => loadStyle(style));
    };
    loadStyles();
    if (unknown.length) {
        console.error(`load file error with unknown file type`, unknown);
    }
};

/**
 * 获取文件类型
 * @param path { string }
 * @returns {string}
 */
function getExtension(path: string = '') {
    var items = path.split('?')[0].split('.');
    return items[items.length - 1].toLowerCase();
}

export const classifyFiles = (files: string[]) => {
    const classifyFiles = {
        js: [] as string[],
        css: [] as string[],
        unknown: [] as string[]
    };
    const { js, css, unknown } = classifyFiles;
    files.forEach(file => {
        const ext = getExtension(file);
        switch (ext) {
            case 'js':
                js.push(file);
                break;
            case 'css':
                css.push(file);
                break;
            default:
                unknown.push(file);
                break;
        }
    });
    return classifyFiles;
};
