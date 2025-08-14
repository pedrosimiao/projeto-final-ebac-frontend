// src/hooks/useNavigateBack.ts

import { useLocation } from "react-router-dom";

export const useNavigateBack = () => {
  const location = useLocation();

  const from = location.state?.from;

  if (typeof from === "string" && from.startsWith("/")) {
    return from;
  }

  return "/home";
};
