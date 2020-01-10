import { createSandbox } from 'z-sandbox';

import Hooks from '../Hooks';
import { classifyFiles, cacheScripts, loadStyle } from '../lib/load';
import { ProjectConfig } from '../interface';

interface OPTIONS {
    useStrict?: boolean;
    useWith?: boolean;
    inheritWindow?: boolean;
    blacklist?: string[];
}

export default class Sandbox {
    constructor(options: OPTIONS) {
        this.options = options;
    }
    options: OPTIONS;
    call({ hooks }: { hooks: Hooks }) {
        const projectMap: { [any: string]: 0 | 1 } = {};
        hooks.amendInstance.tap('amend sandbox', (instance: any, amendInstance: (instanceProps: any) => void) => {
            amendInstance({
                createSandbox
            });
        });
        hooks.loadResources.tapPromise(
            'sandbox load file',
            (project: string, projectConfig: ProjectConfig, interceptor: any) => {
                const { files, mode } = projectConfig;
                const { intercept, fail } = interceptor;
                return new Promise((resolve, reject) => {
                    if (mode === 'sandbox') {
                        intercept();
                        if (projectMap[project]) return resolve();
                        projectMap[project] = 1;
                        const sandbox = createSandbox();
                        const { js, css, unknown } = classifyFiles(files);
                        cacheScripts(js).then((responses: XMLHttpRequest[]) => {
                            responses.forEach(res => {
                                sandbox(res.responseText);
                            });
                            resolve();
                        });
                        css.map(style => loadStyle(style));
                        unknown && unknown.length && console.error('unkown files', unknown);
                    } else {
                        resolve();
                    }
                });
            }
        );
    }
}
