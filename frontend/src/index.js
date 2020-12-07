import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import { createStore } from 'redux';

import 'bootstrap/dist/css/bootstrap.min.css';
import './sass/index.scss';

import App from './App';

import root from './reducers/';

// create redux store
const store = createStore(
    root,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);
