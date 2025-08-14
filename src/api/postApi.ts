// src/api/postApi.ts

import { AxiosResponse, AxiosError } from "axios";
import apiClient from "./apiClient";
import { extractErrorMessage, ApiError } from "../utils/apiErrorUtils";
import { IPost, IPaginatedResponse } from "../types";


type GetPostsPaginatedResponse = AxiosResponse<IPaginatedResponse<IPost[]>>;
type GetPostResponse = AxiosResponse<IPost>;
type CreatePostResponse = AxiosResponse<IPost>;
type GetPostCountResponse = AxiosResponse<{ count: number }>;


export const fetchPostsRequest = async (cursor?: string): Promise<GetPostsPaginatedResponse> => {
  try {
    // cursor ? URL do backend (next/previous) completa.
    const url = cursor ? cursor : "/posts/";
    return await apiClient.get<IPaginatedResponse<IPost[]>>(url);
  } catch (error) {
    if (error instanceof AxiosError) {
      const message = extractErrorMessage(error as AxiosError<ApiError>);
      console.error("Error fetching posts:", message);
      throw error;
    }
    throw error;
  }
};


export const fetchPostsByUserIdRequest = async (
  userId: string,
  cursor?: string
): Promise<GetPostsPaginatedResponse> => {
  try {
    const url = cursor ? cursor : `/posts/?user_id=${userId}`; // Se não tem cursor, começa pela primeira página com o userId
    return await apiClient.get<IPaginatedResponse<IPost[]>>(url);
  } catch (error) {
    if (error instanceof AxiosError) {
      const message = extractErrorMessage(error as AxiosError<ApiError>);
      console.error(`Error fetching posts for user ${userId}:`, message);
      throw error;
    }
    throw error;
  }
};


export const fetchPostByIdRequest = async (postId: string): Promise<GetPostResponse> => {
  try {
    return await apiClient.get<IPost>(`/posts/${postId}/`);
  } catch (error) {
    if (error instanceof AxiosError) {
      const message = extractErrorMessage(error as AxiosError<ApiError>);
      console.error(`Error fetching post ${postId}:`, message);
      throw error;
    }
    throw error;
  }
};


export const fetchFollowingPostsRequest = async (
  cursor?: string
): Promise<GetPostsPaginatedResponse> => {
  try {
    const url = cursor ? cursor : "/posts/following/"; // Usa o endpoint dedicado
    return await apiClient.get<IPaginatedResponse<IPost[]>>(url);
  } catch (error) {
    if (error instanceof AxiosError) {
      const message = extractErrorMessage(error as AxiosError<ApiError>);
      console.error("Error fetching following posts:", message);
      throw error;
    }
    throw error;
  }
};


export const fetchPostCountByUserIdRequest = async (
  userId: string
): Promise<GetPostCountResponse> => {
  try {
    return await apiClient.get<{ count: number }>(`/posts/count/?user_id=${userId}`);
  } catch (error) {
    if (error instanceof AxiosError) {
      const message = extractErrorMessage(error as AxiosError<ApiError>);
      console.error(`Error fetching post count for user ${userId}:`, message);
      throw error;
    }
    throw error;
  }
};


export const createPostRequest = async (formData: FormData): Promise<CreatePostResponse> => {
  try {
    return await apiClient.post<IPost>("/posts/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Error creating post:", error.response?.data || error.message);
      throw error;
    } else if (error instanceof Error) {
      console.error("An unexpected error occurred while creating the post:", error.message);
      throw error;
    }
    throw error;
  }
};


export const deletePostRequest = async (postId: string): Promise<void> => {
  try {
    await apiClient.delete(`/posts/${postId}/`);
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error(
        `An unexpected error occurred while deleting the post ${postId}:`,
        error.response?.data || error.message
      );
      throw error;
    }
    throw error;
  }
};
