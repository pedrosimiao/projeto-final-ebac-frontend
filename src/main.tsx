// src/main.tsx

// Importações de estilos do PrimeReact
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import App from "./App.tsx";
import store from "./store/store";

import { theme } from "./theme.ts";
import { ThemeProvider } from "styled-components";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
      refetchOnMount: true,
      refetchOnReconnect: true,

      retry: 3,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
      </Provider>
    </QueryClientProvider>
  </StrictMode>
);
