import _ from 'lodash';
import { createBrowserHistory } from 'history';
import RAPIOP from '@rapiop/rapiop';

const config = {
    demo: {
        prefix: '/demo/',
        href: '/demo/'
    },
    'demo-2': {
        prefix: '/demo-2/',
        href: '/demo-2/'
    }
};

const getConfig = () => config;

const history = createBrowserHistory();

const app = new RAPIOP({
    getConfig,
    mountDOM: document.getElementById('mount-dom'),
    history,
    plugins: [
        {
            call: ({ hooks }: { hooks: any }) => {
                _.each(hooks, (hook, key) => {
                    hook.tap('log', (...args: any[]) => {
                        console.warn('Hooks triggered: ', key, ...args);
                    });
                });
            }
        }
    ]
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
