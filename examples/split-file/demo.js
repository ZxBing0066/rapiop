window.app.register(
    'demo',
    mountDOM => {
        const content = document.createElement('div');
        content.innerText = 'this is my demo';
        mountDOM.appendChild(content);
        console.log('demo mounted');
    },
    mountDOM => {
        mountDOM.innerHTML = null;
        console.log('demo unmounted');
    }
);
