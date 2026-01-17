import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from '@/components/ui/provider'
import { ContentProvider } from '@/contexts/ContentContext'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider>
      <ContentProvider>
        <App />
      </ContentProvider>
    </Provider>
  </StrictMode>,
)
