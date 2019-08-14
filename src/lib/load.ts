import $script from '@rapiop/scriptjs';
/**
 * 加载并执行文件
 * @param path {string}
 * @param params {Object}
 * @returns promise
 */
const fileCacheMap: {
    [src: string]: 0 | 1;
} = {};

const get = (src: string) => {
    return new Promise((resolve, reject) => {
        var oReq = new XMLHttpRequest();
        oReq.addEventListener('load', e => {
            resolve();
        });
        oReq.addEventListener('abort', e => {
            reject(e);
        });
        oReq.addEventListener('error', e => {
            reject(e);
        });
        oReq.open('GET', src);
        oReq.send();
    });
};

const cacheScript = (src: string) => {
    // start cache
    fileCacheMap[src] = 0;
    if (fileCacheMap[src]) {
        return Promise.resolve();
    }
    return get(src).then(() => {
        // cache success
        fileCacheMap[src] = 1;
    });
};

const loadScript = (src: string) => {
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
    let scripts: string[] = [],
        styles: string[] = [],
        unknownFiles: string[] = [];
    files.forEach(file => {
        const ext = getExtension(file);
        switch (ext) {
            case 'js':
                scripts.push(file);
                break;
            case 'css':
                styles.push(file);
                break;
            default:
                unknownFiles.push(file);
                break;
        }
    });
    const loadScripts = (i: number): Promise<void> => {
        return loadScript(scripts[i]).then(() => ++i < scripts.length && loadScripts(i));
    };
    // load all file in cache to speed up async load
    if (cacheFirst) {
        const cacheScripts = () => {
            const promises = scripts.map(script => cacheScript(script));
            return Promise.all(promises);
        };
        cacheScripts()
            .then(() => loadScripts(0))
            .catch(onError);
    } else {
        loadScripts(0).catch(onError);
    }
    const loadStyles = () => {
        styles.forEach(style => loadStyle(style));
    };
    loadStyles();
    if (unknownFiles.length) {
        console.error(`load file error with unknown file type`, unknownFiles);
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
