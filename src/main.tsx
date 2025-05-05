import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import AppRoutes from "./routes";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "./contexts/auth.context";
import { BrowserRouter } from "react-router-dom";
import { IntegrationProvider } from "./contexts/integration.context";
import "reshaped/themes/slate/theme.css";
import { Reshaped } from "reshaped";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HelmetProvider>
      <Reshaped
        theme="slate"
        defaultColorMode="light"
        toastOptions={{
          bottom: { width: "460px", expanded: false },
        }}
      >
        <Suspense fallback={<div>Loading...</div>}>
          <AuthProvider>
            <IntegrationProvider>
              <BrowserRouter>
                <AppRoutes />
              </BrowserRouter>
            </IntegrationProvider>
          </AuthProvider>
        </Suspense>
      </Reshaped>
    </HelmetProvider>
  </StrictMode>,
);
