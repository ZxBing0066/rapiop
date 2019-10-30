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
                const loading = document.createElement('div');
                loading.id = 'loading';
                loading.innerHTML = `
  <div class="spinner-border" role="status">
    <span class="sr-only">Loading...</span>
  </div>
`;
                frame.appendChild(header);
                frame.appendChild(mountDOM);
                frame.appendChild(iframeMountDOM);
                frame.appendChild(loading);
                document.body.appendChild(frame);
                APP.registerIframeMountDOM(iframeMountDOM);

                const showLoading = () => {loading.style.display = 'flex'};
                const hideLoading = () => (loading.style.display = 'none');

                hideLoading();

                APP.hooks.enter.tap('loading', () => {
                    showLoading();
                })
                APP.hooks.beforeMount.tap('loading', () => {
                    showLoading();
                });
                APP.hooks.afterMount.tap('loading', () => {
                    hideLoading();
                });
                APP.hooks.error.tap('loading', () => {
                    hideLoading();
                });

                return mountDOM;
            });
        });
    });
})();
