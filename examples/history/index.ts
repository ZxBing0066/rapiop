import _ from 'lodash';
import RAPIOP from '@rapiop/rapiop';
import { createBrowserHistory } from 'history';

const createHistory = () => {
    const listeners: (() => void)[] = [];
    return {
        push: (url: string) => {
            window.history.pushState(null, null, url);
            console.log('call listeners');
            _.each(listeners, listener => {
                listener();
            });
        },
        listen: (listener: () => void) => {
            console.log(listener);
            listeners.push(listener);
        }
    };
};

const history = createHistory();

function getConfig() {
    return new Promise(resolve =>
        resolve({
            demo: {
                url: '^/demo/',
                href: '/demo/'
            },
            'demo-2': {
                url: '^/demo-2/',
                href: '/demo-2/'
            }
        })
    );
}
(window as any).init = (historyType: string) => {
    const app = new RAPIOP({
        getConfig,
        history: {
            browser: createBrowserHistory(),
            custom: createHistory()
        }[historyType]
    });

    document.body.removeChild(document.getElementById('action'));

    console.log(app);

    app.registerFrame(() => {
        return new Promise(resolve => {
            const frame = document.createElement('div');
            frame.id = 'frame';
            const header = document.createElement('div');
            header.id = 'header';
            const ul = document.createElement('ul');
            _.each(
                {
                    home: { href: '/' },
                    ...app.config
                },
                (info, key) => {
                    const li = document.createElement('li');
                    const a = document.createElement('a');
                    a.onclick = () => app.navigate(info.href);
                    a.innerText = key;
                    li.appendChild(a);
                    ul.appendChild(li);
                }
            );
            header.appendChild(ul);
            const mountDOM = document.createElement('div');
            mountDOM.id = 'mount-dom';
            frame.appendChild(header);
            frame.appendChild(mountDOM);
            document.body.appendChild(frame);
            resolve(mountDOM);
        });
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
};
