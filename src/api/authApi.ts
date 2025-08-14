// src/api/authApi.ts

// funções p/ chamar a API

import apiClient from "./apiClient";
import { IUser } from "../types";
import { extractErrorMessage } from "../utils/apiErrorUtils";

// resposta de login
export interface AuthResponse {
  user: IUser;
  access: string;
  refresh: string;
}

// resposta da renovação do token
export interface RefreshResponse {
  access: string;
}

// resposta de signup
export interface SignupSuccessResponse {
  id: string;
  username: string;
  email: string;
  bio: string | null;
  profile_picture: string | null;
  cover_image: string | null;
  occupation: string | null;
  location: string | null;
  birth_date: string | null;
  joined_at: string;
  firstName: string;
  lastName: string;
}

export async function loginApi(credentials: {
  identifier: string;
  password: string;
}): Promise<AuthResponse> {
  try {
    const response = await apiClient.post<AuthResponse>("/login/", credentials);
    return response.data;
  } catch (error) {
    throw extractErrorMessage(error);
  }
}

export async function signupApi(userData: {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  confirmPassword: string;
}): Promise<SignupSuccessResponse> {
  try {
    const response = await apiClient.post<SignupSuccessResponse>("/signup/", userData);
    return response.data;
  } catch (error) {
    throw extractErrorMessage(error);
  }
}

export async function refreshTokenApi(refreshToken: string): Promise<RefreshResponse> {
  try {
    const response = await apiClient.post<RefreshResponse>(`/refresh/`, { refresh: refreshToken });
    return response.data;
  } catch (error) {
    throw extractErrorMessage(error);
  }
}
