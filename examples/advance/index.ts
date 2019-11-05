import _ from 'lodash';

import { loadStyle } from '@rapiop/rapiop/lib/lib/load';

import './style.css';
import { init as initFrame } from './frame';
import { init as initApp } from './app';
import { init as initAnotherApp } from './another-app';

const isInIframe = window.top !== window;

const app = initApp(isInIframe);

if (!isInIframe) {
    loadStyle('https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css');
    initFrame();

    const mountDOM = document.getElementById('mount-dom');
    const iframeMountDOM = document.getElementById('iframe-mount-dom');
    const loading = document.getElementById('loading');

    app.hooks.mountDOM.call(mountDOM);
    app.registerIframeMountDOM(iframeMountDOM);

    app.hooks.afterConfig.tap('update menu', (config: any) => {
        const ul = document.createElement('ul');
        ul.className = 'nav justify-content-end';
        _.each(config, (info, key) => {
            if (!info.href) return;
            const li = document.createElement('li');
            li.className = 'nav-item';
            const a = document.createElement('a');
            a.className = 'nav-link';
            a.onclick = () => app.history.push(info.href);
            a.innerText = key;
            li.appendChild(a);
            ul.appendChild(li);
        });
        document.getElementById('menu').appendChild(ul);
    });

    const showLoading = () => {
        loading.style.display = 'flex';
    };
    const hideLoading = () => {
        loading.style.display = 'none';
    };

    app.hooks.enter.tap('loading', () => {
        showLoading();
    });
    app.hooks.beforeMount.tap('loading', () => {
        showLoading();
    });
    app.hooks.afterMount.tap('loading', () => {
        hideLoading();
    });
    app.hooks.error.tap('loading', () => {
        hideLoading();
    });

    const anotherApp = initAnotherApp();
    anotherApp.hooks.mountDOM.call(document.getElementById('another-mount-dom'));
    (window as any)._MY_ANOTHER_APP = anotherApp;
}

(window as any)._MY_APP = app;
