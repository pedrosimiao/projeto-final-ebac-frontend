// src/api/userApi.ts

import { AxiosResponse, AxiosError } from "axios";

import apiClient from "./apiClient";
import { extractErrorMessage, ApiError } from "../utils/apiErrorUtils";

import { IPaginatedResponse, IUser } from "../types";

type UserProfileUpdateResponse = AxiosResponse<Partial<IUser>>;
type ChangePasswordResponse = AxiosResponse<{ message: string }>;
type DeleteAccountResponse = AxiosResponse<{ message: string }>;

export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  username?: string;
  bio?: string;
  occupation?: string;
  location?: string;
  birth_date?: string;
  profile_picture?: File | null;
  cover_image?: File | null;
}


export const getSuggestedUsersRequest = async (): Promise<IUser[]> => {
  try {
    const response = await apiClient.get<IPaginatedResponse<IUser[]>>("/users/suggested/");
    const suggestedUsers = response.data.results;
    return Array.isArray(suggestedUsers) ? suggestedUsers : [];
  } catch (error) {
    if (error instanceof AxiosError) {
      const message = extractErrorMessage(error as AxiosError<ApiError>);
      console.error("Error fetching suggested users:", message);
      throw error;
    }
    throw error;
  }
};


export const searchUsersForMentionRequest = async (query: string): Promise<IUser[]> => {
  try {
    const response = await apiClient.get<IUser[]>(`/users/search/?q=${query}`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const message = extractErrorMessage(error as AxiosError<ApiError>);
      console.error(`Error searching users for mention with query "${query}":`, message);
      throw error;
    }
    throw error;
  }
};


export const fetchCurrentUserRequest = async (): Promise<IUser> => {
  try {
    const response = await apiClient.get<IUser>("/users/me/"); // Chama o endpoint /users/me/
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const message = extractErrorMessage(error as AxiosError<ApiError>);
      console.error("Error fetching current user:", message);
      throw error;
    }
    throw error;
  }
};


export const getUserByUsernameRequest = async (username: string): Promise<IUser> => {
  try {
    const response = await apiClient.get<IUser>(`/users/${username}/`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const message = extractErrorMessage(error as AxiosError<ApiError>);
      console.error(`Error fetching user by username (${username}):`, message);
      throw error;
    }
    throw error;
  }
};


export const updateCurrentUserProfileRequest = async (
  userData: UpdateProfilePayload
): Promise<UserProfileUpdateResponse> => {
  try {
    const formData = new FormData();

    if (userData.firstName) formData.append("firstName", userData.firstName);
    if (userData.lastName) formData.append("lastName", userData.lastName);

    if (userData.username) formData.append("username", userData.username);

    if (userData.bio !== undefined && userData.bio !== null) formData.append("bio", userData.bio);

    if (userData.occupation !== undefined && userData.occupation !== null)
      formData.append("occupation", userData.occupation);

    if (userData.location !== undefined && userData.location !== null)
      formData.append("location", userData.location);

    if (userData.birth_date !== undefined && userData.birth_date !== null)
      formData.append("birth_date", userData.birth_date);

    if (userData.profile_picture) formData.append("profile_picture", userData.profile_picture);
    if (userData.cover_image) formData.append("cover_image", userData.cover_image);

    return await apiClient.patch<Partial<IUser>>(`/users/me/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (error) {
    if (error instanceof AxiosError) {
      const message = extractErrorMessage(error as AxiosError<ApiError>);
      console.error("Error updating current user profile:", message);
      throw error;
    }
    throw error;
  }
};


export const changePasswordRequest = async (
  payload: {
    currentPassword?: string;
    newPassword?: string;
    confirmNewPassword?: string;
  },
): Promise<ChangePasswordResponse> => {
  try {
    return await apiClient.post<{ message: string }>("/change-password/", payload);
  } catch (error) {
    if (error instanceof AxiosError) {
      const message = extractErrorMessage(error as AxiosError<ApiError>);
      console.error("Error changing password:", message);
      throw error;
    }
    throw error;
  }
};

export const deleteAccountRequest = async (
  payload: {
    password?: string;
  },
): Promise<DeleteAccountResponse> => {
  try {
    return await apiClient.delete<{ message: string }>("/delete-account/", { data: payload });
  } catch (error) {
    if (error instanceof AxiosError) {
      const message = extractErrorMessage(error as AxiosError<ApiError>);
      console.error("Error deleting account:", message);
      throw error;
    }
    throw error;
  }
};

