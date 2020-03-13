import { scriptLoad, DependenceMap } from './scriptLoad';

export { cacheScript, cacheScripts, loadScript, loadScripts } from './scriptLoad';

const loadedStyleMap: { [href: string]: boolean } = {};

export const loadStyle = (href: string) => {
    if (loadedStyleMap[href]) return;
    const el = document.createElement('link');
    el.type = 'text/css';
    el.rel = 'stylesheet';
    el.href = href;
    const head = document.head || document.getElementsByTagName('head')[0];
    head.appendChild(el);
    loadedStyleMap[href] = true;
};

export const loadStyles = (css: string[]) => {
    css.forEach(style => loadStyle(style));
};

export const loadResources = (
    files: string[],
    cacheFirst?: boolean,
    onError?: (e: Error) => void,
    dependences?: string[],
    dependenceMap?: DependenceMap
) => {
    if (!files || !files.length) return;
    const { js, css, unknown } = classifyFiles(files);

    scriptLoad(js, cacheFirst, onError, dependences, dependenceMap);
    loadStyles(css);
    if (unknown.length) {
        console.error(`load file error with unknown file type`, unknown);
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

export const classifyFiles = (files: string[]) => {
    const classifyFiles = {
        js: [] as string[],
        css: [] as string[],
        unknown: [] as string[]
    };
    const { js, css, unknown } = classifyFiles;
    files.forEach(file => {
        const ext = getExtension(file);
        switch (ext) {
            case 'js':
                js.push(file);
                break;
            case 'css':
                css.push(file);
                break;
            default:
                unknown.push(file);
                break;
        }
    });
    return classifyFiles;
};
