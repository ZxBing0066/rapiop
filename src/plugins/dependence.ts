import Hooks from '../Hooks';
import { scriptLoad, DependenceShape, DependenceMap as FormattedDependenceMap } from '../lib/scriptLoad';
import { isObject, isArray } from '../util';
import { loadResources } from '../lib/load';
import { ProjectConfig, OnError } from '../interface';

interface DependenceMap {
    [key: string]: string | string[] | DependenceShape;
}

interface Option {
    getDependenceMap: () => Promise<DependenceMap>;
    baseUrl: string;
    cacheBeforeRun: boolean;
    onError: (e: Error) => Promise<any>;
}

function isShape(dependenceInfo: string | string[] | DependenceShape): dependenceInfo is DependenceShape {
    return isObject(dependenceInfo);
}

class Plugin {
    dependenceMap: FormattedDependenceMap;
    option: Option;
    queue: (() => {})[] = [];
    constructor(option: Option) {
        const { getDependenceMap, baseUrl = '' } = option;
        this.option = option;
        getDependenceMap().then((map = {}) => {
            const dependenceMap: FormattedDependenceMap = {};
            for (let dependence in map) {
                const dependenceInfo = map[dependence] || [];
                let files: string[],
                    dependences: string[] = [];
                if (isShape(dependenceInfo)) {
                    files = dependenceInfo.files;
                    dependences = dependenceInfo.dependences;
                } else if (isArray(dependenceInfo)) {
                    files = dependenceInfo as string[];
                } else {
                    files = [dependenceInfo as string];
                }
                dependenceMap[dependence] = {
                    files: files.map(file => (file.match(/^http:\/\//) ? file : `${baseUrl}${file}`)),
                    dependences
                };
            }
            this.dependenceMap = dependenceMap;
            if (this.queue.length) {
                this.queue.forEach(load => {
                    load();
                });
            }
        });
    }
    call = ({ hooks }: { hooks: Hooks }) => {
        const { cacheBeforeRun = true } = this.option;
        hooks.amendInstance.tap('amend loadDependences', (instance, amendInstance) => {
            amendInstance({
                loadDependences: this.loadDependences
            });
        });
        hooks.amendInnerShared.tap('amendInnerShared', (innerShared, amendInnerShared) => {
            amendInnerShared({
                loadResources: (projectConfig: ProjectConfig, onError: OnError) => {
                    const { files, dependences } = projectConfig;
                    return loadResources(files, cacheBeforeRun, onError, dependences, this.dependenceMap);
                }
            });
        });
    };
    loadDependences = (dependences: string[], callback?: () => void): Promise<void> => {
        const { cacheBeforeRun = true, onError = (e: Error) => Promise.reject(e) } = this.option;
        const load = () => scriptLoad([], cacheBeforeRun, onError, dependences, this.dependenceMap);
        return new Promise((resolve, reject) => {
            const _callback = (e?: Error) => {
                if (e) {
                    onError(e);
                    reject(e);
                } else {
                    callback && callback();
                    resolve();
                }
            };
            const runLoad = () =>
                load()
                    .then(() => _callback())
                    .catch((e: Error) => _callback(e));
            if (this.dependenceMap) {
                runLoad();
            } else {
                this.queue.push(runLoad);
            }
        });
    };
}

export default Plugin;
