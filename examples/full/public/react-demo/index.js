(() => {
    const APP = window._MY_APP;

    APP.loadDependences(['React', 'ReactDOM']).then(() => {
        const React = window.React;
        const ReactDOM = window.ReactDOM;

        APP.register(
            'react-demo',
            mountDOM => {
                ReactDOM.render(React.createElement('div', { className: 'test' }, 'this is my react app'), mountDOM);
            },
            mountDOM => {
                ReactDOM.unmountComponentAtNode(mountDOM);
            }
        );
    });
})();
