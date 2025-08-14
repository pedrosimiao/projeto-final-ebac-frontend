// src/routes.tsx

import { BrowserRouter } from "react-router-dom";

import { useAppInitializer } from "./hooks/useAppInitializer"

import MainRoutesContent from "./app/MainRoutesContent";

import FullScreenLoader from "./components/FullScreenLoader";

const AppRoutes = () => {
  const { isLoading }  = useAppInitializer()

  if (isLoading) {
    console.log(`AppRoutes: [Render] isLoading: ${isLoading}. Exibindo tela de carregamento.`);
    return <FullScreenLoader $spinnerColor="text" size="3rem" />
  }

  return (
    <BrowserRouter>
      <MainRoutesContent />
    </BrowserRouter>
  );
};

export default AppRoutes;
