window.app.loadDependences(['error-dependence'], () => {
    window.app.register(
        'error-demo',
        mountDOM => {
            const content = document.createElement('div');
            content.innerText = 'this is my error demo';
            mountDOM.appendChild(content);
            console.log('error demo mounted');
        },
        mountDOM => {
            mountDOM.innerHTML = null;
            console.log('error demo unmounted');
        }
    );
});
