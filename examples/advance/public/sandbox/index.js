window._MY_APP.register(
    'sandbox',
    mountDOM => {
        const content = document.createElement('div');
        content.innerText = 'sandbox';
        mountDOM.appendChild(content);
    },
    mountDOM => {
        mountDOM.innerHTML = null;
    }
);

window.abc = {};

console.log(window.abc);
