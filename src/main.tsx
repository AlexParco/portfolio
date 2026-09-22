import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/geist/index.css'
import '@fontsource-variable/jetbrains-mono/index.css'
import './styles/theme.css'
// Antes que <App>: monta i18next y resuelve el idioma (localStorage → navegador).
import './i18n'
import { App } from './App'

const root = document.getElementById('root')
if (!root) throw new Error('No existe #root en index.html')

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
