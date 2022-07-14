import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import 'fontawesome-free/css/all.min.css'
import './fonts/Rubik-Regular.ttf';
import {createStore} from 'redux';
import protocolReducers from 'state/reducers/index'
import {Provider} from 'react-redux'

export const store = createStore(protocolReducers,
  (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
  (window as any).__REDUX_DEVTOOLS_EXTENSION__()
  );



ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
        <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
)
