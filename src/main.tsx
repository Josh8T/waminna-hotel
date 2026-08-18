import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/hooks/useAuth';
import { ThemeLanguageProvider } from '@/context/ThemeLanguageContext';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ThemeLanguageProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ThemeLanguageProvider>
    </BrowserRouter>
  </StrictMode>
);
