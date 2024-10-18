import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Client from './Client/Client.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Client />
  </StrictMode>,
)
