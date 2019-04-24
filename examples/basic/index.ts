import axios from 'axios';
import _ from 'lodash';

import RAPIOP from '@rapiop/rapiop';

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

const app = new RAPIOP({
    getConfig: getConfig
});

console.log(app);

app.registerFrame((rootDOM: Element) => {
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
        rootDOM.appendChild(frame);
        resolve(mountDOM);
    });
});

app.register(
    'home',
    (mountDOM: Element) => {
        const content = document.createElement('div');
        content.innerText = 'this is my home';
        mountDOM.appendChild(content);
        console.log('mounted');
    },
    (mountDOM: Element) => {
        mountDOM.innerHTML = null;
        console.log('unmounted');
    }
);

app.register(
    'demo',
    (mountDOM: Element) => {
        const content = document.createElement('div');
        content.innerText = 'this is my demo';
        mountDOM.appendChild(content);
        console.log('mounted');
    },
    (mountDOM: Element) => {
        mountDOM.innerHTML = null;
        console.log('unmounted');
    }
);

app.register(
    'demo-2',
    (mountDOM: Element) => {
        const content = document.createElement('div');
        content.innerText = 'this is my demo-2';
        mountDOM.appendChild(content);
        console.log('mounted');
    },
    (mountDOM: Element) => {
        mountDOM.innerHTML = null;
        console.log('unmounted');
    }
);
