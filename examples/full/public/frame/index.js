(() => {
    const APP = window._MY_APP;

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
                frame.appendChild(header);
                frame.appendChild(mountDOM);
                document.body.appendChild(frame);
                return mountDOM;
            });
        });
    });
})();
