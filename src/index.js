import React from 'react';
import ReactDOM from 'react-dom';
import 'style/index.css';
import App from 'containers/App';
import registerServiceWorker from './registerServiceWorker';

// sample branch commit
ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
