import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' // Import this
import App from './App.jsx'
import './index.css'

import { HelmetProvider } from 'react-helmet-async'; // Import HelmetProvider

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter> {/* Wrap App here */}
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>,
)