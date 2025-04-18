import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import AppRoutes from './routes';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './contexts/auth.context';
import { BrowserRouter } from 'react-router-dom';
import { IntegrationProvider } from './contexts/integration.context';
import { ToastContainer } from 'react-toastify';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<HelmetProvider>
			<Suspense fallback={<div>Loading...</div>}>
				<AuthProvider>
					<ToastContainer position="bottom-right" autoClose={3000} />
					<IntegrationProvider>
						<BrowserRouter>
							<AppRoutes />
						</BrowserRouter>
					</IntegrationProvider>
				</AuthProvider>
			</Suspense>
		</HelmetProvider>
	</StrictMode >
);
