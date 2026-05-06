import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ArutalaCompany from './ArutalaCompany'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ArutalaCompany />
  </StrictMode>
)