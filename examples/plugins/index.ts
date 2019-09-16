import _ from 'lodash';
import { createBrowserHistory } from 'history';
import RAPIOP from '@rapiop/rapiop';
import FramePlugin from '@rapiop/rapiop/lib/plugins/frame';
import DependencePlugin from '@rapiop/rapiop/lib/plugins/dependence';

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
    frame: { files: ['/frame.js'] }
};
const dependenceMap = {
    React: { files: ['https://unpkg.com/react@16.9.0/umd/react.production.min.js'] },
    ReactDOM: { files: ['https://unpkg.com/react-dom@16.9.0/umd/react-dom.production.min.js'] },
    test: { files: ['/test.js'], dependences: ['React', 'ReactDOM'] },
    'error-dependence': { files: ['https://error.js'] }
};

function getConfig() {
    return config;
}

const history = createBrowserHistory();
const app = new RAPIOP({
    getConfig,
    history,
    plugins: [
        new FramePlugin(),
        new DependencePlugin({
            getDependenceMap: () => Promise.resolve(dependenceMap),
            onError: (e: Error) => {
                alert(`load dependence error`);
                console.error(e);
            }
        })
    ],
    onError: (e: Error) => {
        console.error(e);
        alert(`error`);
    }
});

(() => {
    const nav = document.getElementById('nav');
    const ul = document.createElement('ul');
    _.each(
        {
            home: { href: '/' },
            ...config
        },
        (info, key) => {
            if (!info.href) {
                return;
            }
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.onclick = () => history.push(info.href);
            a.innerText = key;
            li.appendChild(a);
            ul.appendChild(li);
        }
    );
    nav.appendChild(ul);
})();

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

(window as any).app = app;
