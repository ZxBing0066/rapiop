import { createSandbox } from 'z-sandbox';
import { load } from '@rapiop/mod/lib/loader/fileLoader';
import mod from '@rapiop/mod';

import Hooks from '../Hooks';
import { classifyFiles } from '../lib/load';
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
            async (project: string, projectConfig: ProjectConfig, interceptor: any) => {
                const { files, mode } = projectConfig;
                const { intercept, fail } = interceptor;

                if (mode === 'sandbox') {
                    intercept();
                    if (projectMap[project]) return;
                    projectMap[project] = 1;
                    const sandbox = createSandbox();
                    const { js, css, unknown } = classifyFiles(files);
                    mod.import({ css });
                    const contents = await Promise.all(js.map(load));
                    contents.forEach(content => {
                        sandbox(content);
                    });
                    unknown && unknown.length && console.error('unkown files', unknown);
                }
            }
        );
    }
}
