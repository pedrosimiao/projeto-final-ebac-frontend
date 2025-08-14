// src/hooks/useAuth.ts

// hooks para login, signup e refresh

import { useDispatch } from "react-redux";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import * as authApi from "../api/authApi";
import { setTokens, logout, setAuthChecked } from "../store/slices/authSlice";

import { extractErrorMessage } from "../utils/apiErrorUtils";

/**
 * Hook login user
 */
export const useLogin = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  type LoginCredentials = {
    identifier: string;
    password: string
  };

  return useMutation<authApi.AuthResponse, string, LoginCredentials>({
    mutationFn: async (credentials: LoginCredentials): Promise<authApi.AuthResponse> => {
      try {
        const response = await authApi.loginApi(credentials);
        return response;
      } catch (error) {
        throw extractErrorMessage(error) || "Ocorreu um erro inesperado durante o login.";
      }
    },

    onSuccess: (data: authApi.AuthResponse) => {
      dispatch(setTokens({ accessToken: data.access, refreshToken: data.refresh }));
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      dispatch(setAuthChecked());
      console.log("Login bem-sucedido para:", data.user.username);
    },

    onError: (error: string) => {
      console.error("Erro no login:", error);
      // mesmo em caso de erro, sinaliza que a checagem inicial foi feita (usuário logado)
      dispatch(setAuthChecked());
    },
  });
};

/**
 * Hook registrar user (signup)
 */
export const useSignup = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  type SignupData = {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    confirmPassword: string;
  };

  return useMutation<authApi.SignupSuccessResponse, string, SignupData>({
    mutationFn: async (userData: SignupData): Promise<authApi.SignupSuccessResponse> => {
      try {
        const response = await authApi.signupApi(userData);
        return response;
      } catch (error) {
        throw extractErrorMessage(error) || "Falha no registro";
      }
    },

    onSuccess: (data: authApi.SignupSuccessResponse) => {
      console.log("Registro bem-sucedido para:", data.username);
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      dispatch(setAuthChecked());
    },

    onError: (error: string) => {
      console.error("Erro no registro:", error);
      dispatch(setAuthChecked());
    },
  });
};

/**
 * Hook para renovar o token de acesso (refresh token)
 */
export const useRefreshToken = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation<authApi.RefreshResponse, string, string>({
    mutationFn: (token: string) => authApi.refreshTokenApi(token),

    onSuccess: (data: authApi.RefreshResponse) => {
      dispatch(setTokens({ accessToken: data.access })); // mantém refreshToken existente
      console.log("Access Token renovado com sucesso.");
    },

    onError: (error: string) => {
      console.error("Erro ao renovar token. Realizando logout...", error);
      dispatch(logout());
      queryClient.clear();
      dispatch(setAuthChecked());
    },
  });
};
