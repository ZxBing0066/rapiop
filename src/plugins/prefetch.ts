import Hooks from '../Hooks';
import { Config, InnerShared, OnError } from '../interface';

type Options = {
    autoPrefetchProjects: string[];
    onError?: OnError;
};

export default class Prefetch {
    constructor(options: Options) {
        this.options = options;
    }
    options: Options;
    call({ hooks, innerShared }: { hooks: Hooks; innerShared: InnerShared }) {
        const { requestIdleCallback } = window as any;
        if (!requestIdleCallback) return;

        const { autoPrefetchProjects, onError = (e: Error) => console.error(e) } = this.options;
        let firstMounted = true,
            config: Config;
        const prefetch = (projectKey: string) => {
            requestIdleCallback(() => {
                innerShared.loadResources(config[projectKey], onError);
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
