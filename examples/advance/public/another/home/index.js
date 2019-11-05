(() => {
    const APP = window._MY_ANOTHER_APP;
    APP.register(
        'home',
        mountDOM => {
            const content = document.createElement('div');
            content.innerText = 'this is my home';
            mountDOM.appendChild(content);
            console.log('home mounted');
        },
        mountDOM => {
            mountDOM.innerHTML = null;
            console.log('home unmounted');
        }
    );
})();
