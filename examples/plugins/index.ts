import _ from 'lodash';
import { createBrowserHistory } from 'history';
import RAPIOP from '@rapiop/rapiop';
import FramePlugin from '@rapiop/rapiop/lib/plugins/frame';
import IframePlugin from '@rapiop/rapiop/lib/plugins/iframe';
import mod from '@rapiop/mod';
import '@rapiop/mod/lib/resolver/amd';

const config = {
    demo: {
        prefix: '/demo/',
        href: '/demo/'
    },
    'demo-2': {
        prefix: '/demo-2/',
        href: '/demo-2/'
    },
    'react-demo': {
        prefix: '/react/',
        href: '/react/',
        files: ['/react-demo.js']
    },
    'test-demo': {
        prefix: '/test/',
        href: '/test/',
        files: ['/test-demo.js']
    },
    error: {
        prefix: '/error/',
        href: '/error/',
        files: ['/error.js']
    },
    'error-demo': {
        prefix: '/error-demo/',
        href: '/error-demo/',
        files: ['/error-demo.js']
    },
    frame: { files: ['/frame.js'] },
    'iframe-demo': {
        prefix: '/iframe-demo/',
        href: '/iframe-demo/',
        mode: 'iframe',
        files: ['/iframe-demo.js']
    }
};
const dependenceMap = {
    react: { js: ['https://unpkg.com/react@16.9.0/umd/react.production.min.js'], type: 'amd' },
    'react-dom': {
        js: ['https://unpkg.com/react-dom@16.9.0/umd/react-dom.production.min.js'],
        dep: ['react'],
        type: 'amd'
    },
    lodash: { js: ['https://unpkg.com/lodash@4.17.15/lodash.min.js'], type: 'amd' },
    'error-dependence': { js: ['https://error.js'] }
};

function getConfig() {
    return config;
}
mod.config({ modules: dependenceMap });
const isIframe = window.top != window;

const history = createBrowserHistory();
const app = new RAPIOP({
    config: getConfig,
    history,
    plugins: [...(isIframe ? [new IframePlugin()] : []), new FramePlugin()],
    onError: (e: Error) => {
        console.error(e);
        alert(`error`);
    }
});

app.register(
    'home',
    (mountDOM: Element) => {
        const content = document.createElement('div');
        content.innerText = 'this is my home';
        mountDOM.appendChild(content);
        console.log('home mounted');
    },
    (mountDOM: Element) => {
        mountDOM.innerHTML = null;
        console.log('home unmounted');
    }
);

app.register(
    'demo',
    (mountDOM: Element) => {
        const content = document.createElement('div');
        content.innerText = 'this is my demo';
        mountDOM.appendChild(content);
        console.log('demo mounted');
    },
    (mountDOM: Element) => {
        mountDOM.innerHTML = null;
        console.log('demo unmounted');
    }
);

app.register(
    'demo-2',
    (mountDOM: Element) => {
        const content = document.createElement('div');
        content.innerText = 'this is my demo-2';
        mountDOM.appendChild(content);
        console.log('demo-2 mounted');
    },
    (mountDOM: Element) => {
        mountDOM.innerHTML = null;
        console.log('demo-2 unmounted');
    }
);

app.getConfig = () => config;
app.history = history;

(window as any).app = app;
(window as any).mod = mod;
