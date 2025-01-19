import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import AppRoutes from './routes';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './contexts/auth.context';
import { BrowserRouter } from 'react-router-dom';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <Suspense fallback={<div>Loading...</div>}>
        <AuthProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter >
        </AuthProvider>
      </Suspense>
    </HelmetProvider >
  </StrictMode>
);
