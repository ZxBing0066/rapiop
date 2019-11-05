(() => {
    const APP = window._MY_ANOTHER_APP;
    APP.register(
        'other',
        mountDOM => {
            const content = document.createElement('div');
            content.innerHTML = `
            <p>this is other for anotherApp</p>
`;
            const button = document.createElement('button');
            button.innerText = 'click to jump to home project';
            button.onclick = () => {
                APP.jumpTo('home');
            };
            content.appendChild(button);
            mountDOM.appendChild(content);
            console.log('other mounted');
        },
        mountDOM => {
            mountDOM.innerHTML = null;
            console.log('other unmounted');
        }
    );
})();
