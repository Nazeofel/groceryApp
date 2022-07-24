import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import WindowMenu from './WindowMenu'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <WindowMenu />
    <App />
  </React.StrictMode>
)