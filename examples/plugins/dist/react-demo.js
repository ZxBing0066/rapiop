window.app.loadDependences(['React', 'ReactDOM'], () => {
    const React = window.React;
    const ReactDOM = window.ReactDOM;
    window.app.register(
        'react-demo',
        mountDOM => {
            ReactDOM.render(React.createElement('div', {}, 'react demo'), mountDOM);
            console.log('react demo mounted');
        },
        mountDOM => {
            ReactDOM.unmountComponentAtNode(mountDOM);
            console.log('react demo unmounted');
        }
    );
});
