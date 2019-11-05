import Hooks from '../Hooks';
import { Config } from '../interface';
import { loadResources } from '../lib/load';

type Options = {
    autoPrefetchProjects: string[];
};

export default class Prefetch {
    constructor(options: Options) {
        this.options = options;
    }
    options: Options;
    call({ hooks }: { hooks: Hooks }) {
        const { requestIdleCallback } = window as any;
        if (!requestIdleCallback) return;

        const { autoPrefetchProjects } = this.options;
        let firstMounted = true,
            config: Config;
        const prefetch = (projectKey: string) => {
            requestIdleCallback(() => {
                loadResources(config[projectKey].files);
            });
        };
        hooks.afterConfig.tap('get config', (_config: Config) => {
            config = _config;
        });
        hooks.afterMount.tap('mount first', () => {
            if (autoPrefetchProjects && firstMounted) {
                autoPrefetchProjects.forEach(project => prefetch(project));
            }
            firstMounted = false;
        });
        hooks.amendInstance.tap('amend prefetcher', (instance: any, amendInstance: (instanceProps: any) => void) => {
            amendInstance({
                prefetch: (projects: string[]) => {
                    projects.forEach(project => prefetch(project));
                }
            });
        });
    }
}
