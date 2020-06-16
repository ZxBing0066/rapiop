import Hooks from '../Hooks';
import { loadScript, DependenceShape } from '../lib/scriptLoad';
import { loadResources, loadStyles, classifyFiles } from '../lib/load';
import { ProjectConfig, OnError, AnyFunction } from '../interface';
import { isObject, isArray } from '../util';

let uid = 0;

interface Option {
    module: Module;
    injectToGlobal?: string | true;
    baseUrl: string;
    cacheBeforeRun: boolean;
    onError: (e: Error) => Promise<any>;
}

type ModuleInfo = string | string[] | DependenceShape;

interface ModuleConfig {
    baseUrl?: string;
    moduleMap?: {
        [moduleName: string]: ModuleInfo;
    };
}
interface ModuleOption {
    injectToGlobal?: string | true;
    moduleConfig?: ModuleConfig;
}
interface Module {
    import: AnyFunction;
    export: AnyFunction;
    importModuleFromFiles: AnyFunction;
    config: AnyFunction;
}

function isShape(dependenceInfo: ModuleInfo): dependenceInfo is DependenceShape {
    return isObject(dependenceInfo);
}

const generateGlobalNameSpaceKey = (key?: string): string => {
    if (!key) key = '__RAPIOP_MODULE_NAME_SPACE__' + uid++;
    if (key in window) {
        const oldKey = key;
        key = generateGlobalNameSpaceKey();
        console.warn(`Warning: Warning: module name space key ${oldKey} already existed, fallback to ${key}`);
    }
    return key;
};

const pieceFiles = (files: string[], baseUrl: string): string[] => {
    return files.map(file => (/http(s)?:\/\//.test(file) ? file : baseUrl + file));
};

export const createModule = (option: ModuleOption): Module => {
    let { injectToGlobal, moduleConfig = {} } = option;

    const nameSpace: {
        [moduleName: string]: any;
    } = {};

    if (injectToGlobal) {
        let nameSpaceKey;
        if (typeof injectToGlobal === 'string') {
            nameSpaceKey = injectToGlobal;
            injectToGlobal = true;
        }
        nameSpaceKey = generateGlobalNameSpaceKey(nameSpaceKey);
        (window as any)[nameSpaceKey] = nameSpace;
    }

    const loadModule = async (moduleInfo: ModuleInfo, baseUrl: string) => {
        if (!moduleInfo) return;
        let files: string[], dependences;
        if (isArray(moduleInfo)) {
            files = moduleInfo as string[];
        } else if (isShape(moduleInfo)) {
            files = moduleInfo.files;
            dependences = moduleInfo.dependences;
        } else {
            files = [moduleInfo as string];
        }
        const { js, css, unknown } = classifyFiles(files);
        loadStyles(pieceFiles(css, baseUrl));
        await Promise.all(pieceFiles(js, baseUrl).map(f => loadScript(f)));

        if (unknown.length) {
            console.error(`Warning: load file error with unknown file type`, unknown);
        }
    };

    const load = async (module: string) => {
        const { baseUrl = '', moduleMap = {} } = moduleConfig;
        const moduleInfo = moduleMap[module];
        await loadModule(moduleInfo, baseUrl);
    };

    const getModule = (module: string) => nameSpace[module];

    let jobs: AnyFunction[] = [];

    const checkModulesReady = (modules: string[]) => {
        const l = modules.length;
        let missingModule = false;
        for (let i = 0; i < l; i++) {
            const module = modules[i];
            if (!(module in nameSpace)) {
                missingModule = true;
                break;
            }
        }
        return !missingModule;
    };

    const checkJob = (modules: string[], resolve: AnyFunction) => () => {
        if (checkModulesReady(modules)) {
            resolve();
            return true;
        }
        return false;
    };

    const checkModules = async (modules: string[]) => {
        if (!checkModulesReady(modules)) {
            let end: AnyFunction;
            const peeding = new Promise(resolve => {
                end = resolve;
            });
            const job = checkJob(modules, end);
            jobs.push(job);
            await peeding;
        }
    };

    const runJobs = () => {
        jobs.forEach((job, i) => {
            if (job()) {
                jobs[i] = null;
            }
        });
        jobs = jobs.filter(job => job != null);
    };

    const _import = async (modules: string | string[] = []) => {
        let isSingle = false;
        if (typeof modules === 'string') {
            modules = [modules];
            isSingle = true;
        }
        await Promise.all(modules.map(load));
        await checkModules(modules);
        return isSingle ? getModule(modules[0]) : modules.map(getModule);
    };

    const importModuleFromFiles = async (moduleName: string, moduleInfo: ModuleInfo) => {
        const { baseUrl = '', moduleMap = {} } = moduleConfig;
        if (moduleName in moduleMap) {
            console.error(`Error: Module ${moduleName} already existed in moduleMap`);
            return;
        }
        await loadModule(moduleInfo, baseUrl);
        await checkModules([moduleName]);
        return getModule(moduleName);
    };

    const _export = (moduleName: string, module: any) => {
        if (moduleName in nameSpace) {
            console.error(`Warning: Module ${moduleName} already existed, you can't export duplicated`);
        } else {
            nameSpace[moduleName] = module;
        }
        runJobs();
    };

    const config = (config: ModuleConfig) => {
        moduleConfig = config;
    };
    return {
        import: _import,
        export: _export,
        importModuleFromFiles,
        config
    };
};

class Plugin {
    option: Option;
    module: Module;
    constructor(option: Option) {
        const { module } = option;
        this.option = option;
        this.module = module;
    }
    call = ({ hooks }: { hooks: Hooks }) => {
        hooks.amendInnerShared.tap('amendInnerShared', (innerShared, amendInnerShared) => {
            amendInnerShared({
                loadResources: async (projectConfig: ProjectConfig, onError: OnError) => {
                    const { files, dependences, waitForDependences } = projectConfig;
                    try {
                        if (waitForDependences) {
                            await this.module.import(dependences);
                            await loadResources(files, false, onError);
                        } else {
                            await Promise.all([this.module.import(dependences), loadResources(files, false, onError)]);
                        }
                    } catch (error) {
                        onError(error);
                        throw error;
                    }
                }
            });
        });
    };
}

export default Plugin;
