import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import 'fontawesome-free/css/all.min.css'
import './fonts/Rubik-Regular.ttf';
import './fonts/Rubik-Bold.ttf';
import './index.css';
import App from './App';
import { store, persistor } from './state/store';
import { PersistGate } from 'redux-persist/integration/react';


ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
)
