import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import App from './App'
import { store } from './store'
import './styles/globals.css'

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 1000 * 60 * 5, retry: 1 } },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <App />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#0D0D0D', color: '#F5F0E8',
              fontFamily: 'DM Sans, sans-serif', fontSize: '0.88rem',
              borderLeft: '3px solid #C9A84C',
            },
          }}
        />
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>
)
