import React from 'react';
import ReactDOM from 'react-dom';

import '@/configuration/axios.config.js';

import '@/css/iconfont.js';
import './index.css';

import App from '@/App';

import * as serviceWorker from './serviceWorker';

ReactDOM.render(
	<div>
		<App />
	</div>
  , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
