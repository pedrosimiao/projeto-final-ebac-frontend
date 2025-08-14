// src/api/likeApi.ts

import apiClient from "./apiClient";
import { extractErrorMessage, ApiError } from "../utils/apiErrorUtils";
import { AxiosError, AxiosResponse } from "axios";

export interface LikeResponse {
  liked: boolean;
  message: string;
}

export interface UnlikeResponse {
  unliked: boolean;
  message: string;
  error?: string; // caso de erro 400 da API
}

// LIKE POST
export const postLikePost = async (postId: string): Promise<LikeResponse> => {
  try {
    // POST /api/likes/posts/ {postId: ...}
    const response: AxiosResponse<LikeResponse> = await apiClient.post("/likes/posts/", { postId });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const message = extractErrorMessage(error as AxiosError<ApiError>);
      console.error("Error liking post:", message);
      if (error.response && error.response.data) {
        throw error.response.data as ApiError;
      }
      throw error;
    }
    throw error;
  }
};

// DELETE LIKE POST
export const deleteLikePost = async (postId: string): Promise<UnlikeResponse> => {
  try {
    // DELETE from  /api/likes/posts/unlike/ {postId: ...}
    // response: 204 No Content & JSON {"unliked": True, "message": "Post unliked"}
    const response: AxiosResponse<UnlikeResponse> = await apiClient.delete("/likes/posts/unlike/", {
      data: { postId },
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const message = extractErrorMessage(error as AxiosError<ApiError>);
      console.error("Error unliking post:", message);
      if (error.response && error.response.data) {
        throw error.response.data as ApiError;
      }
      throw error;
    }
    throw error;
  }
};


// LIKE COMMENT
export const postLikeComment = async (commentId: string): Promise<LikeResponse> => {
  try {
    // POST /api/likes/comments/ {commentId: ...}
    const response: AxiosResponse<LikeResponse> = await apiClient.post("/likes/comments/", {
      commentId,
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const message = extractErrorMessage(error as AxiosError<ApiError>);
      console.error("Error liking comment:", message);
      if (error.response && error.response.data) {
        throw error.response.data as ApiError;
      }
      throw error;
    }
    throw error;
  }
};


//  DELETE LIKE COMMENT
export const deleteLikeComment = async (commentId: string): Promise<UnlikeResponse> => {
  try {
    // DELETE from  /api/likes/comments/unlike/ {commentId: ...}
    // response: 204 No Content & JSON {"unliked": True, "message": "Comment unliked"}
    const response: AxiosResponse<UnlikeResponse> = await apiClient.delete("/likes/comments/unlike", {
      data: { commentId },
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const message = extractErrorMessage(error as AxiosError<ApiError>);
      console.error("Error unliking comment:", message);
      if (error.response && error.response.data) {
        throw error.response.data as ApiError;
      }
      throw error;
    }
    throw error;
  }
};


// GET counts & status

export interface CountResponse {
  count: number;
}

export interface HasLikedResponse {
  has_liked: boolean;
}


// POST LIKES COUNT
export const fetchPostLikesCount = async (postId: string): Promise<CountResponse> => {
  try {
    const response: AxiosResponse<CountResponse> = await apiClient.get(`/likes/posts/${postId}/count/`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const message = extractErrorMessage(error as AxiosError<ApiError>);
      console.error(`Error fetching post likes count for ${postId}:`, message);
      if (error.response && error.response.data) {
        throw error.response.data as ApiError;
      }
      throw error;
    }
    throw error;
  }
};


// COMMENT LIKES COUNT
export const fetchCommentLikesCount = async (commentId: string): Promise<CountResponse> => {
  try {
    const response: AxiosResponse<CountResponse> = await apiClient.get(`/likes/comments/${commentId}/count/`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const message = extractErrorMessage(error as AxiosError<ApiError>);
      console.error(`Error fetching comment likes count for ${commentId}:`, message);
      if (error.response && error.response.data) {
        throw error.response.data as ApiError;
      }
      throw error;
    }
    throw error;
  }
};


// HAS LIKED POST
export const fetchHasLikedPost = async (postId: string): Promise<HasLikedResponse> => {
  try {
    const response: AxiosResponse<HasLikedResponse> = await apiClient.get(`/likes/posts/${postId}/has_liked/`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const message = extractErrorMessage(error as AxiosError<ApiError>);
      console.error(`Error fetching has liked post status for ${postId}:`, message);
      if (error.response && error.response.data) {
        throw error.response.data as ApiError;
      }
      throw error;
    }
    throw error;
  }
};


// HAS LIKED COMMENT
export const fetchHasLikedComment = async (commentId: string): Promise<HasLikedResponse> => {
  try {
    const response: AxiosResponse<HasLikedResponse> = await apiClient.get(`/likes/comments/${commentId}/has_liked/`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const message = extractErrorMessage(error as AxiosError<ApiError>);
      console.error(`Error fetching has liked comment status for ${commentId}:`, message);
      if (error.response && error.response.data) {
        throw error.response.data as ApiError;
      }
      throw error;
    }
    throw error;
  }
};
