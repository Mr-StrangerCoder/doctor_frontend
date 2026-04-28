
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import React from 'react'
import { Provider } from 'react-redux'
import store from './redux/Store.js'
import 'bootstrap/dist/css/bootstrap.min.css';
  import 'bootstrap/dist/css/bootstrap.css';
   import "bootstrap/dist/js/bootstrap.bundle.min.js";
   import 'bootstrap/dist/css/bootstrap.min.css';

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
)