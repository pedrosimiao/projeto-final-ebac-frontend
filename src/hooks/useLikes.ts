// src/hooks/useLikes.ts

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

// API functions & response interfaces
import {
  postLikePost,
  deleteLikePost,
  postLikeComment,
  deleteLikeComment,
  fetchPostLikesCount,
  fetchCommentLikesCount,
  fetchHasLikedPost,
  fetchHasLikedComment,
  LikeResponse,
  UnlikeResponse,
  CountResponse,
  HasLikedResponse,
} from "../api/likeApi";

import { ApiError, extractErrorMessage } from "../utils/apiErrorUtils";
import { isTempId } from "../utils/idUtils";

import { useCurrentUserProfile } from "./useUsers";

// --- query keys post & comment ---
import { POST_KEYS } from "./usePosts";
import { COMMENT_KEYS } from "./useComments";

import { IComment } from "../types"; // IPost removido, pois não é utilizado

// --- query keys de like ---
export const LIKE_KEYS = {
  all: ["likes"] as const,

  postLikesCount: (postId: string) => [...LIKE_KEYS.all, "post", postId, "count"] as const,
  commentLikesCount: (commentId: string) =>
    [...LIKE_KEYS.all, "comment", commentId, "count"] as const,
  hasLikedPost: (postId: string) => [...LIKE_KEYS.all, "post", postId, "hasLiked"] as const,
  hasLikedComment: (commentId: string) =>
    [...LIKE_KEYS.all, "comment", commentId, "hasLiked"] as const,
};

// --- QUERIES ---

/**
 * Hook para obter a contagem de likes de um post específico.
 */
export function usePostLikesCount(postId: string | undefined) {
  // query SEMPRE habilitada se houver um postId,
  // queryFn lida com IDs temporários localmente
  const enabledQuery = !!postId;

  return useQuery<CountResponse, AxiosError<ApiError>, number>({
    queryKey: LIKE_KEYS.postLikesCount(postId || ""),
    queryFn: async ({ queryKey }) => {
      const actualPostId = queryKey[2] as string;
      if (!actualPostId || isTempId(actualPostId)) {
        // se ID for temp | undefined, retorna 0 likes sem fazer chamada de rede
        // post recém-criado exibe 0 likes imediatamente
        return { count: 0 };
      }
      const response = await fetchPostLikesCount(actualPostId);
      return response;
    },
    select: data => data.count,
    enabled: enabledQuery, // enabled baseado na existência do ID
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: true,
  });
}

/**
 * Hook para obter a contagem de likes de um comentário específico.
 */
export function useCommentLikesCount(commentId: string | undefined) {
  const enabledQuery = !!commentId; // Sempre habilitado se o ID existe

  return useQuery<CountResponse, AxiosError<ApiError>, number>({
    queryKey: LIKE_KEYS.commentLikesCount(commentId || ""),
    queryFn: async ({ queryKey }) => {
      const actualCommentId = queryKey[2] as string;
      if (!actualCommentId || isTempId(actualCommentId)) {
        return { count: 0 };
      }
      const response = await fetchCommentLikesCount(actualCommentId);
      return response;
    },
    select: data => data.count,
    enabled: enabledQuery,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: true,
  });
}

/**
 * Hook para verificar se o usuário logado curtiu um post específico.
 */
export function useHasLikedPost(postId: string | undefined) {
  const { data: currentUser } = useCurrentUserProfile();
  const isUserAuthenticated = !!currentUser?.id;

  const enabledQuery = !!postId && isUserAuthenticated; // enable se ID existe & usuário autenticado

  return useQuery<HasLikedResponse, AxiosError<ApiError>, boolean>({
    queryKey: LIKE_KEYS.hasLikedPost(postId || ""),
    queryFn: async ({ queryKey }) => {
      const actualPostId = queryKey[2] as string;
      if (!actualPostId || isTempId(actualPostId)) {
        // se ID for temp, retorna false sem fazer chamada de rede
        // post recém-criado exibe "não curtido" imediatamente.
        return { has_liked: false };
      }
      const response = await fetchHasLikedPost(actualPostId);
      return response;
    },
    select: data => data.has_liked,
    enabled: enabledQuery,
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
  });
}

/**
 * Hook para verificar se o usuário logado curtiu um comentário específico.
 */
export function useHasLikedComment(commentId: string | undefined) {
  const { data: currentUser } = useCurrentUserProfile();
  const isUserAuthenticated = !!currentUser?.id;

  const enabledQuery = !!commentId && isUserAuthenticated;

  return useQuery<HasLikedResponse, AxiosError<ApiError>, boolean>({
    queryKey: LIKE_KEYS.hasLikedComment(commentId || ""),
    queryFn: async ({ queryKey }) => {
      const actualCommentId = queryKey[2] as string;
      if (!actualCommentId || isTempId(actualCommentId)) {
        return { has_liked: false };
      }
      const response = await fetchHasLikedComment(actualCommentId);
      return response;
    },
    select: data => data.has_liked,
    enabled: enabledQuery,
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
  });
}


// --- MUTATIONS ---

/**
 * Hook para curtir um post.
 */
export function useLikePost() {
  const queryClient = useQueryClient();
  const { data: currentUser } = useCurrentUserProfile();
  const currentUserId = currentUser?.id;

  type LikePostVariables = string; // postId
  type LikePostContext = {
    previousCount: number | undefined;
    previousStatus: boolean | undefined;
  };

  return useMutation<LikeResponse, AxiosError<ApiError>, LikePostVariables, LikePostContext>({
    // MODIFICAÇÃO: mutationFn lida com IDs temporários
    mutationFn: async (postIdToLike: string) => {
      if (!currentUserId) {
        throw new Error("User must be authenticated to like a post.");
      }
      // se ID for temp, simula resposta de sucesso
      if (isTempId(postIdToLike)) {
        console.warn("Simulating like success for temporary post:", postIdToLike);
        // Retorna um mock de LikeResponse para que o onSuccess seja chamado.
        // A mensagem é apenas para fins de depuração.
        return { message: "Simulated like for temporary post." } as LikeResponse;
      }
      // Se for um ID real, faz a chamada de API real
      return await postLikePost(postIdToLike);
    },

    onMutate: async (postIdToLike: string): Promise<LikePostContext> => {
      await queryClient.cancelQueries({ queryKey: LIKE_KEYS.postLikesCount(postIdToLike) });
      await queryClient.cancelQueries({ queryKey: LIKE_KEYS.hasLikedPost(postIdToLike) });

      // Snapshot dos valores anteriores
      const previousCount = queryClient.getQueryData<number>(
        LIKE_KEYS.postLikesCount(postIdToLike)
      );
      const previousStatus = queryClient.getQueryData<boolean>(
        LIKE_KEYS.hasLikedPost(postIdToLike)
      );

      // optimistic update: incrementar contagem e setar status para true
      queryClient.setQueryData(LIKE_KEYS.postLikesCount(postIdToLike), (old: number | undefined) =>
        old !== undefined ? old + 1 : 1
      );
      queryClient.setQueryData(LIKE_KEYS.hasLikedPost(postIdToLike), true);

      // contexto para possível rollback
      return { previousCount, previousStatus };
    },


    onSuccess: (data, variables) => {
      console.log("Post like operation completed:", data);
      // invalida queries se o ID for real.
      // IDs temp não precisam de refetch do servidor.
      if (!isTempId(variables)) {
        // <--- MUDANÇA AQUI
        queryClient.invalidateQueries({ queryKey: LIKE_KEYS.postLikesCount(variables) });
        queryClient.invalidateQueries({ queryKey: LIKE_KEYS.hasLikedPost(variables) });

        queryClient.invalidateQueries({ queryKey: POST_KEYS.lists() });
        queryClient.invalidateQueries({ queryKey: POST_KEYS.following() });
        queryClient.invalidateQueries({ queryKey: POST_KEYS.userPosts(currentUser?.id as string) });
        queryClient.invalidateQueries({ queryKey: POST_KEYS.detail(variables) });
      } else {
        // Se foi uma simulação, opcionalmente fazer um refetch forçado
        // das queries de posts (listas) para garantir que o post real seja carregado
        // com o ID correto e as informações de like (0 ou 1) do servidor.
        // Isso é mais relevante para o useCreatePost, mas pode ser um fallback aqui.
        // queryClient.invalidateQueries({ queryKey: POST_KEYS.lists() });
        // queryClient.invalidateQueries({ queryKey: POST_KEYS.following() });
        // queryClient.invalidateQueries({ queryKey: POST_KEYS.userPosts(currentUser?.id as string) });
        console.log("No server-side invalidation for temporary post like.");
      }
    },


    onError: (error, variables, context) => {
      console.error("Error liking post:", extractErrorMessage(error));
      // Rollback apenas se o erro ocorreu para um ID real (i.e., não foi uma simulação abortada)
      if (context && !isTempId(variables)) {
        queryClient.setQueryData(LIKE_KEYS.postLikesCount(variables), context.previousCount);
        queryClient.setQueryData(LIKE_KEYS.hasLikedPost(variables), context.previousStatus);
      }
      // De qualquer forma, invalida as queries de posts para forçar uma sincronização
      // caso o estado tenha ficado inconsistente ou o post real tenha sido criado.
      queryClient.invalidateQueries({ queryKey: POST_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: POST_KEYS.following() });
      queryClient.invalidateQueries({ queryKey: POST_KEYS.userPosts(currentUser?.id as string) });
      queryClient.invalidateQueries({ queryKey: POST_KEYS.detail(variables) });
    },
  });
}

/**
 * Hook para descurtir um post.
 */
export function useUnlikePost() {
  const queryClient = useQueryClient();
  const { data: currentUser } = useCurrentUserProfile();
  const currentUserId = currentUser?.id;

  type UnlikePostVariables = string; // postId
  type UnlikePostContext = {
    previousCount: number | undefined;
    previousStatus: boolean | undefined;
  };

  return useMutation<UnlikeResponse, AxiosError<ApiError>, UnlikePostVariables, UnlikePostContext>({
    mutationFn: async (postIdToUnlike: string) => {
      if (!currentUserId) throw new Error("User must be authenticated to unlike a post.");

      if (isTempId(postIdToUnlike)) {
        console.warn("Simulating unlike success for temporary post:", postIdToUnlike);
        return { message: "Simulated unlike for temporary post." } as UnlikeResponse;
      }
      return await deleteLikePost(postIdToUnlike);
    },
    onMutate: async (postIdToUnlike: string): Promise<UnlikePostContext> => {
      await queryClient.cancelQueries({ queryKey: LIKE_KEYS.postLikesCount(postIdToUnlike) });
      await queryClient.cancelQueries({ queryKey: LIKE_KEYS.hasLikedPost(postIdToUnlike) });

      const previousCount = queryClient.getQueryData<number>(
        LIKE_KEYS.postLikesCount(postIdToUnlike)
      );
      const previousStatus = queryClient.getQueryData<boolean>(
        LIKE_KEYS.hasLikedPost(postIdToUnlike)
      );

      queryClient.setQueryData(
        LIKE_KEYS.postLikesCount(postIdToUnlike),
        (old: number | undefined) => (old && old > 0 ? old - 1 : 0)
      );
      queryClient.setQueryData(LIKE_KEYS.hasLikedPost(postIdToUnlike), false);

      return { previousCount, previousStatus };
    },
    onSuccess: (data, variables) => {
      console.log("Post unlike operation completed:", data);
      if (!isTempId(variables)) {
        queryClient.invalidateQueries({ queryKey: LIKE_KEYS.postLikesCount(variables) });
        queryClient.invalidateQueries({ queryKey: LIKE_KEYS.hasLikedPost(variables) });

        queryClient.invalidateQueries({ queryKey: POST_KEYS.lists() });
        queryClient.invalidateQueries({ queryKey: POST_KEYS.following() });
        queryClient.invalidateQueries({ queryKey: POST_KEYS.userPosts(currentUser?.id as string) });
        queryClient.invalidateQueries({ queryKey: POST_KEYS.detail(variables) });
      } else {
        console.log("No server-side invalidation for temporary post unlike.");
      }
    },
    onError: (error, variables, context) => {
      console.error("Error unliking post:", extractErrorMessage(error));
      if (context && !isTempId(variables)) {
        // <--- MUDANÇA AQUI
        queryClient.setQueryData(LIKE_KEYS.postLikesCount(variables), context.previousCount);
        queryClient.setQueryData(LIKE_KEYS.hasLikedPost(variables), context.previousStatus);
      }
      queryClient.invalidateQueries({ queryKey: POST_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: POST_KEYS.following() });
      queryClient.invalidateQueries({ queryKey: POST_KEYS.userPosts(currentUser?.id as string) });
      queryClient.invalidateQueries({ queryKey: POST_KEYS.detail(variables) });
    },
  });
}

/**
 * Hook para curtir um comentário.
 */
export function useLikeComment() {
  const queryClient = useQueryClient();
  const { data: currentUser } = useCurrentUserProfile();
  const currentUserId = currentUser?.id;

  type LikeCommentVariables = string; // commentId
  type LikeCommentContext = {
    previousCount: number | undefined;
    previousStatus: boolean | undefined;
    commentId: string;
    parentCommentId: string | undefined;
    postIdOfComment: string | undefined;
  };

  return useMutation<LikeResponse, AxiosError<ApiError>, LikeCommentVariables, LikeCommentContext>({
    mutationFn: async (commentIdToLike: string) => {
      if (!currentUserId) {
        throw new Error("User must be authenticated to like a comment.");
      }
      if (isTempId(commentIdToLike)) {
        console.warn("Simulating like success for temporary comment:", commentIdToLike);
        return { message: "Simulated like for temporary comment." } as LikeResponse;
      }
      return await postLikeComment(commentIdToLike);
    },
    onMutate: async (commentIdToLike: string): Promise<LikeCommentContext> => {
      // obter o comment do cache
      // extrair postId e parentCommentId
      const commentBeingLiked = queryClient.getQueryData<IComment>(
        COMMENT_KEYS.detail(commentIdToLike)
      );
      const postIdOfComment = commentBeingLiked?.post_id;
      const parentCommentId = commentBeingLiked?.parent_comment?.id;

      await queryClient.cancelQueries({ queryKey: LIKE_KEYS.commentLikesCount(commentIdToLike) });
      await queryClient.cancelQueries({ queryKey: LIKE_KEYS.hasLikedComment(commentIdToLike) });

      const previousCount = queryClient.getQueryData<number>(
        LIKE_KEYS.commentLikesCount(commentIdToLike)
      );
      const previousStatus = queryClient.getQueryData<boolean>(
        LIKE_KEYS.hasLikedComment(commentIdToLike)
      );

      queryClient.setQueryData(
        LIKE_KEYS.commentLikesCount(commentIdToLike),
        (old: number | undefined) => (old !== undefined ? old + 1 : 1)
      );
      queryClient.setQueryData(LIKE_KEYS.hasLikedComment(commentIdToLike), true);

      return {
        previousCount,
        previousStatus,
        commentId: commentIdToLike,
        parentCommentId,
        postIdOfComment,
      };
    },
    onSuccess: (data, variables) => {
      console.log("Comment like operation completed:", data);
      if (!isTempId(variables)) {
        queryClient.invalidateQueries({ queryKey: LIKE_KEYS.commentLikesCount(variables) });
        queryClient.invalidateQueries({ queryKey: LIKE_KEYS.hasLikedComment(variables) });

        const context = queryClient
          .getMutationCache()
          .find({ mutationKey: ["likeComment", variables] })?.state.context as
          | LikeCommentContext
          | undefined;
        if (context?.postIdOfComment) {
          queryClient.invalidateQueries({
            queryKey: COMMENT_KEYS.rootList(context.postIdOfComment),
          });
        }
        if (context?.parentCommentId) {
          queryClient.invalidateQueries({
            queryKey: COMMENT_KEYS.repliesList(context.parentCommentId),
          });
          queryClient.invalidateQueries({ queryKey: COMMENT_KEYS.detail(context.parentCommentId) });
        }
        queryClient.invalidateQueries({ queryKey: COMMENT_KEYS.detail(variables) });
      } else {
        console.log("No server-side invalidation for temporary comment like.");
      }
    },
    onError: (error, variables, context) => {
      console.error("Error liking comment:", extractErrorMessage(error));
      if (context && !isTempId(variables)) {
        queryClient.setQueryData(LIKE_KEYS.commentLikesCount(variables), context.previousCount);
        queryClient.setQueryData(LIKE_KEYS.hasLikedComment(variables), context.previousStatus);
      }

      if (context?.postIdOfComment) {
        queryClient.invalidateQueries({ queryKey: COMMENT_KEYS.rootList(context.postIdOfComment) });
      }

      if (context?.parentCommentId) {
        queryClient.invalidateQueries({
          queryKey: COMMENT_KEYS.repliesList(context.parentCommentId),
        });
        queryClient.invalidateQueries({ queryKey: COMMENT_KEYS.detail(context.parentCommentId) });
      }

      queryClient.invalidateQueries({ queryKey: COMMENT_KEYS.detail(variables) });
    },
  });
}

/**
 * Hook para descurtir um comentário.
 */
export function useUnlikeComment() {
  const queryClient = useQueryClient();
  const { data: currentUser } = useCurrentUserProfile();
  const currentUserId = currentUser?.id;

  type UnlikeCommentVariables = string; // commentId
  type UnlikeCommentContext = {
    previousCount: number | undefined;
    previousStatus: boolean | undefined;
    commentId: string;
    parentCommentId: string | undefined;
    postIdOfComment: string | undefined;
  };

  return useMutation<
    UnlikeResponse,
    AxiosError<ApiError>,
    UnlikeCommentVariables,
    UnlikeCommentContext
  >({
    mutationFn: async (commentIdToUnlike: string) => {
      if (!currentUserId) throw new Error("User must be authenticated to unlike a comment.");

      if (isTempId(commentIdToUnlike)) {
        console.warn("Simulating unlike success for temporary comment:", commentIdToUnlike);
        return { message: "Simulated unlike for temporary comment." } as UnlikeResponse;
      }

      return await deleteLikeComment(commentIdToUnlike);
    },
    onMutate: async (commentIdToUnlike: string): Promise<UnlikeCommentContext> => {
      const commentBeingUnliked = queryClient.getQueryData<IComment>(
        COMMENT_KEYS.detail(commentIdToUnlike)
      );
      const postIdOfComment = commentBeingUnliked?.post_id;
      const parentCommentId = commentBeingUnliked?.parent_comment?.id;

      await queryClient.cancelQueries({ queryKey: LIKE_KEYS.commentLikesCount(commentIdToUnlike) });
      await queryClient.cancelQueries({ queryKey: LIKE_KEYS.hasLikedComment(commentIdToUnlike) });

      const previousCount = queryClient.getQueryData<number>(
        LIKE_KEYS.commentLikesCount(commentIdToUnlike)
      );
      const previousStatus = queryClient.getQueryData<boolean>(
        LIKE_KEYS.hasLikedComment(commentIdToUnlike)
      );

      queryClient.setQueryData(
        LIKE_KEYS.commentLikesCount(commentIdToUnlike),
        (old: number | undefined) => (old && old > 0 ? old - 1 : 0)
      );
      queryClient.setQueryData(LIKE_KEYS.hasLikedComment(commentIdToUnlike), false);

      return {
        previousCount,
        previousStatus,
        commentId: commentIdToUnlike,
        parentCommentId,
        postIdOfComment,
      };
    },
    onSuccess: (data, variables) => {
      console.log("Comment unlike operation completed:", data);
      if (!isTempId(variables)) {
        queryClient.invalidateQueries({ queryKey: LIKE_KEYS.commentLikesCount(variables) });
        queryClient.invalidateQueries({ queryKey: LIKE_KEYS.hasLikedComment(variables) });

        const context = queryClient
          .getMutationCache()
          .find({ mutationKey: ["unlikeComment", variables] })?.state.context as
          | UnlikeCommentContext
          | undefined;
        if (context?.postIdOfComment) {
          queryClient.invalidateQueries({
            queryKey: COMMENT_KEYS.rootList(context.postIdOfComment),
          });
        }
        if (context?.parentCommentId) {
          queryClient.invalidateQueries({
            queryKey: COMMENT_KEYS.repliesList(context.parentCommentId),
          });
          queryClient.invalidateQueries({ queryKey: COMMENT_KEYS.detail(context.parentCommentId) });
        }
        queryClient.invalidateQueries({ queryKey: COMMENT_KEYS.detail(variables) });
      } else {
        console.log("No server-side invalidation for temporary comment unlike.");
      }
    },
    onError: (error, variables, context) => {
      console.error("Error unliking comment:", extractErrorMessage(error));
      if (context && !isTempId(variables)) {
        queryClient.setQueryData(LIKE_KEYS.commentLikesCount(variables), context.previousCount);
        queryClient.setQueryData(LIKE_KEYS.hasLikedComment(variables), context.previousStatus);
      }
      if (context?.postIdOfComment) {
        queryClient.invalidateQueries({ queryKey: COMMENT_KEYS.rootList(context.postIdOfComment) });
      }
      if (context?.parentCommentId) {
        queryClient.invalidateQueries({
          queryKey: COMMENT_KEYS.repliesList(context.parentCommentId),
        });
        queryClient.invalidateQueries({ queryKey: COMMENT_KEYS.detail(context.parentCommentId) });
      }
      queryClient.invalidateQueries({ queryKey: COMMENT_KEYS.detail(variables) });
    },
  });
}
