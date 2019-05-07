import _ from 'lodash';

const app = window.app;

app.registerFrame(rootDOM => {
    return new Promise(resolve => {
        const frame = document.createElement('div');
        frame.id = 'frame';
        const header = document.createElement('div');
        header.id = 'header';
        const ul = document.createElement('ul');
        _.each(app.config, (info, key) => {
            if (!info.href) return;
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.onclick = () => app.navigate(info.href);
            a.innerText = key;
            li.appendChild(a);
            ul.appendChild(li);
        });
        header.appendChild(ul);
        const mountDOM = document.createElement('div');
        mountDOM.id = 'mount-dom';
        frame.appendChild(header);
        frame.appendChild(mountDOM);
        rootDOM.appendChild(frame);
        resolve(mountDOM);
    });
});
