(() => {
    const APP = window._MY_APP;
    // APP.hooks.exitProject.tap('show loading', () => {
    //     document.getElementById('loading').style.display = 'block';
    // });
    // APP.hooks.enterProject.tap('hide loading', () => {
    //     document.getElementById('loading').style.display = 'none';
    // });
    APP.loadDependences(['React', 'ReactDOM', 'lodash']).then(() => {
        const _ = window._;
        APP.registerFrame(() => {
            return APP.getConfig().then(config => {
                const frame = document.createElement('div');
                frame.id = 'frame';
                const header = document.createElement('div');
                header.id = 'header';
                const ul = document.createElement('ul');
                ul.className = 'nav justify-content-end';
                _.each(config, (info, key) => {
                    if (!info.href) return;
                    const li = document.createElement('li');
                    li.className = 'nav-item';
                    const a = document.createElement('a');
                    a.className = 'nav-link';
                    a.onclick = () => APP.history.push(info.href);
                    a.innerText = key;
                    li.appendChild(a);
                    ul.appendChild(li);
                });
                header.appendChild(ul);
                const mountDOM = document.createElement('div');
                mountDOM.id = 'mount-dom';
                const iframeMountDOM = document.createElement('div');
                iframeMountDOM.id = 'iframe-mount-dom';
                iframeMountDOM.style.display = 'none';
                const loadingDOM = document.createElement('div');
                loadingDOM.id = 'loading';
                loadingDOM.style.display = 'none';
                frame.appendChild(header);
                frame.appendChild(mountDOM);
                frame.appendChild(iframeMountDOM);
                frame.appendChild(loadingDOM);
                document.body.appendChild(frame);
                APP.registerIframeMountDOM(iframeMountDOM);
                return mountDOM;
            });
        });
    });
})();
