window.app.loadDependences(['React', 'ReactDOM'], () => {
    const React = window.React;
    const ReactDOM = window.ReactDOM;
    window.app.register(
        'iframe-demo',
        mountDOM => {
            ReactDOM.render(React.createElement('div', {}, 'iframe demo'), mountDOM);
            console.log('iframe demo mounted');
        },
        mountDOM => {
            ReactDOM.unmountComponentAtNode(mountDOM);
            console.log('iframe demo unmounted');
        }
    );
});
