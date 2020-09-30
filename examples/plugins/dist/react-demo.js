window.mod.import(['react', 'react-dom']).then(([React, ReactDOM]) => {
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
