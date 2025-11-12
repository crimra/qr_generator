import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import QRGenerator from './components/QRGenerator.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QRGenerator />
  </StrictMode>,
)
