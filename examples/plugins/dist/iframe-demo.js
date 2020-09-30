window.mod.import(['react', 'react-dom']).then(([React, ReactDOM]) => {
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
