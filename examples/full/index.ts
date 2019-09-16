import _ from 'lodash';
import { createBrowserHistory } from 'history';
import RAPIOP from '@rapiop/rapiop';
import FramePlugin from '@rapiop/rapiop/lib/plugins/frame';

let config: any;

function getConfig() {
    return new Promise(resolve => {
        config = {
            demo: {
                url: '^/demo/',
                href: '/demo/'
            },
            'demo-2': {
                url: '^/demo-2/',
                href: '/demo-2/'
            }
        };
        resolve(config);
    });
}
const history = createBrowserHistory();

let interceptedMounted = false;
const interceptedMount = (mountDOM: Element) => {
    const content = document.createElement('div');
    content.innerText = 'mount intercepted';
    mountDOM.appendChild(content);
    interceptedMounted = true;
};
const interceptedUnmount = (mountDOM: Element) => {
    mountDOM.innerHTML = null;
    interceptedMounted = false;
};

const app = RAPIOP({
    getConfig,
    history,
    plugins: [new FramePlugin()]
});

app.hooks.beforeMount.tap('listen', () => {
    console.debug('beforeMount', 'start beforeMount time log');
});

app.hooks.beforeMount.tapPromise('test promise', () => {
    console.debug('beforeMount', 'promise called');
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
            console.debug('beforeMount', 'promise called end');
        }, 4000);
    });
});

app.hooks.beforeMount.tapPromise(
    'confirm promise',
    ({ callOrigin, mountDOM }: { callOrigin: (call: boolean) => void; mountDOM: Element }) => {
        console.debug('beforeMount', 'confirm called');
        return new Promise(resolve => {
            if (confirm('Intercept to mount the project?')) {
                interceptedMount(mountDOM);
                callOrigin(false);
            }
            resolve();
            console.debug('beforeMount', 'confirm called end');
        });
    }
);

app.hooks.beforeUnmount.tapPromise(
    'clean intercepted',
    ({ callOrigin, mountDOM }: { callOrigin: (call: boolean) => void; mountDOM: Element }) => {
        return new Promise((resolve, reject) => {
            if (interceptedMounted) {
                interceptedUnmount(mountDOM);
                callOrigin(false);
            }
            resolve();
            console.debug('beforeUnmount');
        });
    }
);

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
