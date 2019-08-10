import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import MainRouter from './components/main-router';
import * as serviceWorker from './serviceWorker';
import './common_from_baseframe/less/override.less'

ReactDOM.render(<MainRouter />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
