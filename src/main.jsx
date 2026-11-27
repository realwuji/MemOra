import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import '@/lib/fonts'
import './index.css'
import './server.css'
import App from './App.jsx'
import AppProvider from '@/context/AppProvider'
import { initPwa } from '@/lib/pwa'

initPwa()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AppProvider>
        <App />
      </AppProvider>
    </BrowserRouter>
  </StrictMode>
)
