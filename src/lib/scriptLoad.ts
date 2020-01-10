import $script from '@rapiop/scriptjs';

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

export const loadScript = (src: string): Promise<any> => {
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

export const loadScripts = (js: string[]): Promise<void> => {
    return loadScript(js[0]).then(() => {
        const restJS = js.slice(1);
        return restJS && loadScripts(js.slice(1));
    });
};

export const cacheScripts = (js: string[]) => {
    const promises = js.map(script => cacheScript(script));
    return Promise.all(promises);
};

export interface DependenceShape {
    dependences: string[];
    files: string[];
}

export interface DependenceMap {
    [key: string]: DependenceShape;
}

export const scriptLoad = (
    files: string[],
    cacheFirst: boolean,
    onError?: (e: Error) => void,
    dependences?: string[],
    dependencesMap?: DependenceMap
) => {
    const load = (files: string[], dependences: string[], execOrder?: boolean): Promise<any> => {
        const dependenceQueue: Promise<any>[] = [];
        dependences &&
            dependences.forEach(dependence => {
                let files: string[], dependences: string[];
                const dependenceInfo = dependencesMap[dependence];
                if (!dependenceInfo) return;
                files = dependenceInfo.files;
                dependences = dependenceInfo.dependences;
                dependenceQueue.push(load(files, dependences));
            });

        const fileQueue: Promise<any>[] = [];
        // load dependences job
        let dependenceJob = Promise.all(dependenceQueue);
        // if files is empty
        if (!files || !files.length) return dependenceJob;
        // if there is no dependences, don't cache first file
        if (!dependenceQueue.length) {
            // exec with file order
            if (execOrder) {
                let restFiles = files.slice(1);
                let preJob = loadScript(files[0]);
                restFiles.forEach(file => {
                    preJob = Promise.all([cacheFirst && cacheScript(file), preJob]).then(() => loadScript(file));
                });
                fileQueue.push(preJob);
            } else {
                files.forEach(file => {
                    fileQueue.push(loadScript(file));
                });
            }
        } else {
            if (execOrder) {
                let preJob = dependenceJob;
                files.forEach(file => {
                    preJob = Promise.all([cacheFirst && cacheScript(file), preJob]).then(() => loadScript(file));
                });
                fileQueue.push(preJob);
            } else {
                files.forEach(file =>
                    fileQueue.push(
                        Promise.all([cacheFirst && cacheScript(file), dependenceJob]).then(() => loadScript(file))
                    )
                );
            }
        }
        return Promise.all(fileQueue);
    };
    return load(files, dependences, true).catch(onError);
};
