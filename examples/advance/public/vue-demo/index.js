(() => {
    const APP = window._MY_APP;
    const mod = window.mod;

    mod.import('vue').then(Vue => {
        const container = (() => {
            const div = document.createElement('div');
            div.id = 'vue-app';
            div.innerText = '{{ message }}';
            return div;
        })();
        let vue = null;

        APP.register(
            'vue-demo',
            mountDOM => {
                mountDOM.appendChild(container);
                vue = new Vue({
                    el: '#vue-app',
                    data: {
                        message: 'Hello Vue!'
                    }
                });
            },
            mountDOM => {
                vue.$destroy();
                mountDOM.innerHTML = null;
            }
        );
    });
})();
