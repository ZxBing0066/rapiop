window.mod.import(['test.js']).then(() => {
    window.app.register(
        'test-demo',
        mountDOM => {
            const content = document.createElement('div');
            content.innerText = 'this is my test demo';
            mountDOM.appendChild(content);
            console.log('test demo mounted');
        },
        mountDOM => {
            mountDOM.innerHTML = null;
            console.log('test demo unmounted');
        }
    );
});
