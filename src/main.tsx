import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
//import App from './App.tsx'
import './index.css'
import TutorialCheck from './TutorialCheck.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TutorialCheck />
  </StrictMode>,
)
