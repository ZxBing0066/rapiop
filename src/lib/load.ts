import mod from '@rapiop/mod';

import { ProjectConfig } from '../interface';

export interface DependenceShape {
    dependences: string[];
    files: string[];
}

export interface DependenceMap {
    [key: string]: DependenceShape;
}

export const loadResources = async (projectConfig: ProjectConfig, onError?: (e: Error) => void) => {
    const { files, dependences, orderExec } = projectConfig;
    if (!files || !files.length) return;
    const { js, css, unknown } = classifyFiles(files);
    try {
        await mod.import({
            js,
            css,
            dep: dependences,
            orderExec
        });
    } catch (error) {
        onError(error);
    }

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
    const classifyFiles: {
        js: string[];
        css: string[];
        unknown: string[];
    } = {
        js: [],
        css: [],
        unknown: []
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
