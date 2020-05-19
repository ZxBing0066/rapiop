import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

const APP = window._MY_APP;

APP.register(
    'react15-demo',
    mountDOM => {
        ReactDOM.render(<App />, mountDOM);
    },
    mountDOM => {
        ReactDOM.unmountComponentAtNode(mountDOM);
    }
);
