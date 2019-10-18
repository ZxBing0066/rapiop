(() => {
    const APP = window._MY_APP;

    APP.loadDependences(['Vue']).then(() => {
        const Vue = window.Vue;
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
