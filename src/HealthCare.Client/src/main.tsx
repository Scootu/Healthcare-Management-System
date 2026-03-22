import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import './index.css';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
 
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client= {new QueryClient()}>
    <BrowserRouter basename="/" >
      <App />
    </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
)
