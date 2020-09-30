window.mod.import(['lodash']).then(() => {
    console.log(123);
    const app = window.app;
    const _ = window._;
    app.registerFrame(() => {
        const nav = document.createElement('nav');
        const ul = document.createElement('ul');
        const config = window.app.getConfig();
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
                a.onclick = () => app.history.push(info.href);
                a.innerText = key;
                li.appendChild(a);
                ul.appendChild(li);
            }
        );
        nav.appendChild(ul);

        const mountDOM = document.createElement('div');
        document.body.appendChild(nav);
        document.body.appendChild(mountDOM);
        return Promise.resolve(mountDOM);
    });
});
