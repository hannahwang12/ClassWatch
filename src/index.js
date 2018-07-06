import React from 'react';
import ReactDOM from 'react-dom';
import Favicon from 'react-favicon';
import App from './containers/App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  <div>
    <Favicon url="../public/favicon.ico"/>
    <App />
  </div>, document.getElementById('root'));
registerServiceWorker();
