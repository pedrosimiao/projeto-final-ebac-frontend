// src/api/followApi.ts

import apiClient from "./apiClient";
import { extractErrorMessage, ApiError } from "../utils/apiErrorUtils";
import { AxiosError, AxiosResponse } from "axios";
import { IPaginatedResponse, IUser } from "../types";

// interfaces para os retornos das APIs
interface FollowResponse {
  followed: boolean;
  message: string;
}

interface UnfollowResponse {
  unfollowed: boolean;
  message: string;
  error?: string;
}

export const postFollowUser = async (targetUserId: string): Promise<FollowResponse> => {
  try {
    const response: AxiosResponse<FollowResponse> = await apiClient.post("/follows/follow/", {
      targetUserId: targetUserId,
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const message = extractErrorMessage(error as AxiosError<ApiError>);
      console.error("Error following user:", message);
      if (error.response && error.response.data) {
        throw error.response.data as ApiError;
      }
      throw error;
    }
    throw error;
  }
};


export const deleteFollowUser = async (targetUserId: string): Promise<UnfollowResponse | void> => {
  try {
    const response: AxiosResponse<UnfollowResponse> = await apiClient.delete("/follows/unfollow/", {
      data: { targetUserId: targetUserId },
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const message = extractErrorMessage(error as AxiosError<ApiError>);
      console.error("Error unfollowing user:", message);
      if (error.response && error.response.data) {
        throw error.response.data as ApiError;
      }
      throw error;
    }
    throw error;
  }
};


export const getFollowersCount = async (userId: string): Promise<{ count: number }> => {
  try {
    const response = await apiClient.get<{ count: number }>(
      `/follows/users/${userId}/followers/count/`
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error(
        `Error fetching followers count for user ${userId}:`,
        extractErrorMessage(error)
      );
      throw error.response?.data || error;
    }
    throw error;
  }
};


export const getFollowingCount = async (userId: string): Promise<{ count: number }> => {
  try {
    const response = await apiClient.get<{ count: number }>(
      `/follows/users/${userId}/following/count/`
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error(
        `Error fetching following count for user ${userId}:`,
        extractErrorMessage(error)
      );
      throw error.response?.data || error;
    }
    throw error;
  }
};


export const getIsFollowedByMe = async (
  targetUserId: string
): Promise<{ is_followed_by_me: boolean }> => {
  try {
    const response = await apiClient.get<{ is_followed_by_me: boolean }>(
      `/follows/users/${targetUserId}/is_followed_by_me/`
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error(
        `Error checking if following user ${targetUserId}:`,
        extractErrorMessage(error)
      );
      throw error.response?.data || error;
    }
    throw error;
  }
};


export const getFollowersList = async (
  userId: string,
  page: number
): Promise<IPaginatedResponse<IUser[]>> => {
  try {
    const response = await apiClient.get<IPaginatedResponse<IUser[]>>(
      `/follows/users/${userId}/followers/?page=${page}`
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error(
        `Error fetching followers list for user ${userId}:`,
        extractErrorMessage(error)
      );
      throw error.response?.data || error;
    }
    throw error;
  }
};


export const getFollowingList = async (
  userId: string,
  page: number
): Promise<IPaginatedResponse<IUser[]>> => {
  try {
    const response = await apiClient.get<IPaginatedResponse<IUser[]>>(
      `/follows/users/${userId}/following/?page=${page}`
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error(
        `Error fetching following list for user ${userId}:`,
        extractErrorMessage(error)
      );
      throw error.response?.data || error;
    }
    throw error;
  }
};
