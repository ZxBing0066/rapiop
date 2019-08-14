interface scriptjs {
    (
        paths: string | string[],
        idOrDone: string | ((e?: ProgressEvent) => void),
        optDone?: (e?: ProgressEvent) => void
    ): scriptjs;
    get(path: string, fn: () => void): void;
    order(scripts: string[], id: string, done: () => void): void;
    path(p: string): void;
    urlArgs(str: string): void;
    ready(deps: string | string[], ready: () => void, req?: (missing: string[]) => void): scriptjs;
}

declare module '@rapiop/scriptjs' {
    var scriptjs: scriptjs;
    export = scriptjs;
}
