// src/api/commentApi.ts

import { AxiosResponse, AxiosError } from "axios";
import apiClient from "./apiClient";
import { extractErrorMessage, ApiError } from "../utils/apiErrorUtils";
import { IComment, IPaginatedResponse } from "../types";

type GetCommentsPaginatedResponse = AxiosResponse<IPaginatedResponse<IComment[]>>;
type GetCommentResponse = AxiosResponse<IComment>;

/**
 * Função para buscar comentários raiz de um post (paginada).
 * `cursor` será a URL completa de `next` ou `previous`.
 */
export const fetchRootCommentsRequest = async (
  postId: string,
  cursor?: string
): Promise<GetCommentsPaginatedResponse> => {
  try {
    // Se um cursor é fornecido, use-o diretamente (ele já é a URL completa do `next` ou `previous`)
    // Caso contrário, construa a URL inicial para os comentários raiz de um post.
    const url = cursor ? cursor : `/posts/${postId}/comments/`; // URL base do backend para root comments
    const response = await apiClient.get<IPaginatedResponse<IComment[]>>(url);
    return response;
  } catch (error) {
    let errorMessage: string;
    if (error && (error as AxiosError).isAxiosError) {
      const axiosError = error as AxiosError<ApiError>;
      errorMessage = extractErrorMessage(axiosError);
      console.error("Error fetching root comments:", errorMessage);
      throw axiosError;
    } else if (error instanceof Error) {
      errorMessage = error.message;
      console.error("Error fetching root comments:", errorMessage);
      throw error;
    } else {
      const message = "An unexpected error occurred while fetching root comments";
      console.error(message);
      throw new Error(message);
    }
  }
};


/**
 * Função para buscar respostas para um comentário pai específico (paginada).
 */
export const fetchRepliesToCommentRequest = async (
  parentCommentId: string,
  cursor?: string // Também paginada
): Promise<GetCommentsPaginatedResponse> => {
  try {
    const url = cursor
      ? cursor
      : `/comments/?parent_comment_id=${parentCommentId}`; // Rota geral de comments com filtro
    const response = await apiClient.get<IPaginatedResponse<IComment[]>>(url);
    return response;
  } catch (error) {
    let errorMessage: string;
    if (error && (error as AxiosError).isAxiosError) {
      const axiosError = error as AxiosError<ApiError>;
      errorMessage = extractErrorMessage(axiosError);
      console.error(`Error fetching replies for comment ${parentCommentId}:`, errorMessage);
      throw axiosError;
    } else if (error instanceof Error) {
      errorMessage = error.message;
      console.error(`Error fetching replies for comment ${parentCommentId}:`, errorMessage);
      throw error;
    } else {
      const message = `An unexpected error occurred while fetching replies for comment ${parentCommentId}`;
      console.error(message);
      throw new Error(message);
    }
  }
};


/**
 * Função para buscar um único comentário por ID.
 */
export const fetchCommentByIdRequest = async (commentId: string): Promise<GetCommentResponse> => {
  try {
    return await apiClient.get<IComment>(`/comments/${commentId}/`);
  } catch (error) {
    if (error instanceof AxiosError) {
      const message = extractErrorMessage(error as AxiosError<ApiError>);
      console.error(`Error fetching comment ${commentId}:`, message);
      throw error;
    }
    throw error;
  }
};


/**
 * Função para criar um novo comentário ou resposta.
 * Retorna diretamente o dado (IComment) do servidor.
 */
export const createCommentRequest = async (formData: FormData): Promise<IComment> => {
  try {
    // O backend espera 'post' e 'parent_comment' (se aplicável) como chaves para os IDs.
    // O CommentViewSet já lida com a lógica de post_id e parent_comment_id.
    const response = await apiClient.post<IComment>("/comments/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data; // Retorna diretamente o dado (IComment)
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Error creating comment:", error.response?.data || error.message);
      throw error;
    } else if (error instanceof Error) {
      console.error("An unexpected error occurred while creating the comment:", error.message);
      throw error;
    }
    throw error;
  }
};

/**
 * Função para deletar um comentário por ID.
 */
export const deleteCommentRequest = async (commentId: string): Promise<void> => {
  try {
    await apiClient.delete(`/comments/${commentId}/`);
  } catch (error) {
    if ((error as AxiosError).isAxiosError) {
      const axiosError = error as AxiosError<ApiError>;
      const message = extractErrorMessage(axiosError);
      console.error(`Error deleting comment ${commentId}:`, message);
      throw axiosError;
    } else if (error instanceof Error) {
      console.error(`Unexpected error deleting comment ${commentId}:`, error.message);
      throw error;
    }
    throw new Error("An unknown error occurred while deleting the comment.");
  }
};
