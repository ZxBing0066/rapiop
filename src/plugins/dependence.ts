import $script from '@rapiop/scriptjs';
import _ from 'lodash';

interface DependenceShape {
    dependences: string[];
    files?: string[];
    file?: string[];
}

interface DependenceMap {
    [key: string]: string | string[] | DependenceShape;
}

interface Option {
    getDependenceMap: () => Promise<DependenceMap>;
    baseUrl: string;
    onError: (e: Error) => Promise<any>;
}

class Plugin {
    dependenceMap: DependenceMap;
    baseUrl: string;
    onError: (e: Error) => Promise<any>;
    queue: (() => {})[] = [];
    constructor(option: Option) {
        const { getDependenceMap, baseUrl = '', onError = (e: Error) => Promise.reject(e) } = option;
        this.baseUrl = baseUrl;
        this.onError = onError;
        getDependenceMap().then((map = {}) => {
            this.dependenceMap = map;
            if (this.queue.length) {
                this.queue.forEach(load => {
                    load();
                });
            }
        });
    }
    bind = (app: any) => {
        app.loadDependences = this.loadDependences;
    };
    loadDependences = (dependences: string[], callback?: () => void): Promise<void> => {
        function isShape(dependenceInfo: string | string[] | DependenceShape): dependenceInfo is DependenceShape {
            return Object.prototype.toString.call(dependenceInfo) === '[object Object]';
        }
        const load = () => {
            const _load = (dependenceFiles: string[]): Promise<void> => {
                const getFilePath = (file: string) => this.baseUrl + file;

                dependenceFiles = dependenceFiles.map((file: string) => getFilePath(file));

                return new Promise((resolve, reject) => {
                    $script(dependenceFiles, e => {
                        if (e && e.type === 'error') {
                            reject(e);
                        } else {
                            resolve();
                        }
                    });
                });
            };

            let dependedDependences: string[] = [];
            let dependenceFiles: string[] = [];
            dependences.forEach((dependence: string) => {
                const dependenceInfo = this.dependenceMap[dependence];
                if (isShape(dependenceInfo)) {
                    dependedDependences = dependedDependences.concat(dependenceInfo.dependences);
                    dependenceFiles = dependenceFiles.concat(dependenceInfo.files || dependenceInfo.file);
                } else {
                    dependenceFiles = dependenceFiles.concat(dependenceInfo);
                }
            });
            let handler = Promise.resolve();
            if (!_.isEmpty(dependedDependences)) {
                handler = this.loadDependences(dependedDependences);
            }
            return handler.then(() => _load(dependenceFiles));
        };
        return new Promise((resolve, reject) => {
            const _callback = (e?: Error) => {
                callback && callback();
                if (e) {
                    this.onError(e);
                    reject(e);
                } else {
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
