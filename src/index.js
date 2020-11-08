import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
//Back compatibility for ES5


//Fonts
import './roboto.css'
import './roboto/robotoi1.woff2'; 
import './roboto/robotoi3.woff2'; 
import './roboto/robotoi4.woff2'; 
import './roboto/robotoi5.woff2'; 
import './roboto/robotoi7.woff2'; 
import './roboto/roboto1.woff2'; 
import './roboto/roboto3.woff2'; 
import './roboto/roboto4.woff2'; 
import './roboto/roboto5.woff2'; 
import './roboto/roboto7.woff2'; 
import './roboto/roboto9.woff2'; 


import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import 'antd/dist/antd.css';

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
