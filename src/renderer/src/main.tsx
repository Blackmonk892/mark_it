import { MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './assets/index.css'
import { MediaProvider } from './store/MediaContext'
import { NotesProvider } from './store/NotesContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider>
      <MediaProvider>
        <NotesProvider>
          <App />
        </NotesProvider>
      </MediaProvider>
    </MantineProvider>
  </StrictMode>
)
