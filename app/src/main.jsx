import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import WindowMenu from './WindowMenu'

ReactDOM.createRoot(document.querySelector('#menu')).render(
  <React.StrictMode>
    <WindowMenu />
  </React.StrictMode>
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);