import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { useEffect } from 'react';
import  unmountComponentAtNode  from 'react-clear-cache';
import { store } from './store/store.js';
import registerServiceWorker from './registerServiceWorker';
import mainCss from "./assets/sass/main.module.scss";
import App from './app.js';


window.onbeforeunload = function () {
  unmountComponentAtNode(document.getElementById('root'));
}


ReactDOM.render(
  
  <Provider store={ store }>
    <App mainCss={mainCss}/>
  </Provider>,
  document.getElementById('root')
);

registerServiceWorker();