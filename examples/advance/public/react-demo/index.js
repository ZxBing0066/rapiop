(() => {
    const APP = window._MY_APP;
    const mod = window.mod;
    mod.import(['react', 'react-dom', 'emotion', '@emotion/core', '@emotion/styled']).then(
        ([React, ReactDOM, emotion, emotionCore, emotionStyled]) => {
            const style = emotion.css`
                background: red;
                color: white;
            `;
            const styledDiv = () =>
                React.createElement(emotionStyled('div')`color: green;`, {}, 'this is a styled div');
            APP.register(
                'react-demo',
                mountDOM => {
                    ReactDOM.render(
                        React.createElement(
                            'div',
                            { className: `test ${style}` },
                            React.createElement(styledDiv, {}, 'this is my react app')
                        ),
                        mountDOM
                    );
                },
                mountDOM => {
                    ReactDOM.unmountComponentAtNode(mountDOM);
                }
            );
        }
    );
})();
