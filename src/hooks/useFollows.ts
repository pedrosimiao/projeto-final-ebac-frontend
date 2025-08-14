// src/hooks/useFollows.ts

import { useQuery, useMutation, useQueryClient, useInfiniteQuery, InfiniteData } from "@tanstack/react-query";

import { useCurrentUserProfile } from "./useUsers";

// funções de src/api/ relacionadas a seguir/deixar de seguir.
import {
  postFollowUser,
  deleteFollowUser,
  getFollowersCount,
  getFollowingCount,
  getIsFollowedByMe,
  getFollowersList,
  getFollowingList
} from "../api/followApi";

import { ApiError, extractErrorMessage } from "../utils/apiErrorUtils";

import { AxiosError } from "axios";

import { IPaginatedResponse, IUser } from "../types";

// --- query keys follow ---
export const FOLLOW_KEYS = {
  // query key base para todas as queries de follow.
  all: ["follows"] as const, // Mantém 'as const' para a chave raiz, útil para invalidação geral.

  // query key para a contagem de seguidores de um user específico.
  followersCount: (userId: string) => [...FOLLOW_KEYS.all, "followers", "count", userId] as const,
  // query key para a contagem de seguidos de um user específico.
  followingCount: (userId: string) => [...FOLLOW_KEYS.all, "following", "count", userId] as const,

  // query key para a lista de seguidores
  followersList: (userId: string) => [...FOLLOW_KEYS.all, "followers", "list", userId],
  // query key para a lista de seguidos
  followingList: (userId: string) => [...FOLLOW_KEYS.all, "following", "list", userId],

  // query key verifição de follow
  isFollowing: (currentUserId: string, targetUserId: string) =>
    [...FOLLOW_KEYS.all, "isFollowing", currentUserId, targetUserId] as const,
};



// --- QUERIES ---


/**
 * Hook para obter a contagem de seguidores de um usuário específico.
 */
export function useFollowersCount(userId: string | undefined) {
  return useQuery<number, AxiosError<ApiError>>({
    // queryKey específica para a contagem.
    queryKey: FOLLOW_KEYS.followersCount(userId || "unknown"),

    queryFn: async () => {
      if (!userId) return 0;
      const data = await getFollowersCount(userId);
      return data.count;
    },

    enabled: !!userId,

    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });
}


/**
 * Hook para obter a contagem de usuários que um usuário específico está seguindo.
 */
export function useFollowingCount(userId: string | undefined) {
  return useQuery<number, AxiosError<ApiError>>({
    queryKey: FOLLOW_KEYS.followingCount(userId || "unknown"),
    queryFn: async () => {
      if (!userId) return 0;
      const data = await getFollowingCount(userId);
      return data.count;
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });
}


/**
 * Hook para verificar se o usuário logado está seguindo um usuário alvo.
 */
export function useIsFollowing(targetUserId: string | undefined) {
  const { data: currentUser } = useCurrentUserProfile(false);
  const currentUserId = currentUser?.id;

  return useQuery<boolean, AxiosError<ApiError>>({
    queryKey: FOLLOW_KEYS.isFollowing(currentUserId || "no-user", targetUserId || "no-target"),
    queryFn: async () => {
      if (!currentUserId || !targetUserId) return false;
      const data = await getIsFollowedByMe(targetUserId);
      return data.is_followed_by_me;
    },
    enabled: !!currentUserId && !!targetUserId,
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
  });
}


/**
 * Hook para obter a lista paginada de seguidores de um usuário.
 */
export function useFollowersList(userId: string | undefined) {
  return useInfiniteQuery<IPaginatedResponse<IUser[]>, AxiosError<ApiError>, InfiniteData<IPaginatedResponse<IUser[]>>, string[], number>({
    queryKey: FOLLOW_KEYS.followersList(userId || "unknown"),
    queryFn: ({ pageParam = 1 }) => getFollowersList(userId as string, pageParam),

    initialPageParam: 1,

    getNextPageParam: (lastPage) => {
      if (!lastPage.next) return undefined;
      const url = new URL(lastPage.next);
      const page = url.searchParams.get('page');
      return page ? parseInt(page, 10) : undefined;
    },

    enabled: !!userId,
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5,
  });
}

/**
 * Hook para obter a lista paginada de usuários que um usuário segue.
 */
export function useFollowingList(userId: string | undefined) {
  return useInfiniteQuery<IPaginatedResponse<IUser[]>, AxiosError<ApiError>, InfiniteData<IPaginatedResponse<IUser[]>>, string[], number>({
    queryKey: FOLLOW_KEYS.followingList(userId || "unknown"),
    queryFn: ({ pageParam = 1 }) => getFollowingList(userId as string, pageParam),

    initialPageParam: 1,

    getNextPageParam: (lastPage) => {
      if (!lastPage.next) return undefined;
      const url = new URL(lastPage.next);
      const page = url.searchParams.get('page');
      return page ? parseInt(page, 10) : undefined;
    },

    enabled: !!userId,
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5,
  });
}



// --- MUTATIONS ---


/**
 * Hook para seguir um usuário.
 */
export function useFollowUser() {
  const queryClient = useQueryClient();
  const { data: currentUser } = useCurrentUserProfile(false);
  const currentUserId = currentUser?.id;

  type FollowData = { followed: boolean; message: string };
  type FollowError = AxiosError<ApiError>;
  type FollowVariables = string; // targetUserId

  type FollowContext = {
    previousFollowersCount: number | undefined;
    previousFollowingCount: number | undefined;
    previousIsFollowing: boolean | undefined;
    previousSuggestedUsers: IUser[] | undefined;
  };

  return useMutation<FollowData, FollowError, FollowVariables, FollowContext>({
    mutationFn: postFollowUser,

    onMutate: async (targetUserId: string): Promise<FollowContext> => {
      if (!currentUserId) {
        throw new Error("User must be authenticated to follow others.");
      }

      await queryClient.cancelQueries({ queryKey: FOLLOW_KEYS.followersCount(targetUserId) });
      await queryClient.cancelQueries({ queryKey: FOLLOW_KEYS.followingCount(currentUserId) });
      await queryClient.cancelQueries({ queryKey: FOLLOW_KEYS.isFollowing(currentUserId, targetUserId) });
      await queryClient.cancelQueries({ queryKey: ["suggestedUsers"] });
      await queryClient.cancelQueries({ queryKey: ["posts", "following"] });

      const previousFollowersCount = queryClient.getQueryData<number>(FOLLOW_KEYS.followersCount(targetUserId));
      const previousFollowingCount = queryClient.getQueryData<number>(FOLLOW_KEYS.followingCount(currentUserId));
      const previousIsFollowing = queryClient.getQueryData<boolean>(FOLLOW_KEYS.isFollowing(currentUserId, targetUserId));
      const previousSuggestedUsers = queryClient.getQueryData<IUser[]>(["suggestedUsers"]);

      queryClient.setQueryData<IUser[]>(["suggestedUsers"], (oldSuggested) => oldSuggested?.filter(user => user.id !== targetUserId) || []);
      queryClient.setQueryData<number>(FOLLOW_KEYS.followingCount(currentUserId), (old) => (old ?? 0) + 1);
      queryClient.setQueryData<number>(FOLLOW_KEYS.followersCount(targetUserId), (old) => (old ?? 0) + 1);
      queryClient.setQueryData<boolean>(FOLLOW_KEYS.isFollowing(currentUserId, targetUserId), true);

      return { previousFollowersCount, previousFollowingCount, previousIsFollowing, previousSuggestedUsers };
    },

    onSuccess: (data, variables) => { // Removed 'context' parameter
      if (currentUserId) {
        console.log("User successfully followed", data);

        queryClient.invalidateQueries({ queryKey: FOLLOW_KEYS.followersCount(variables) });
        queryClient.invalidateQueries({ queryKey: FOLLOW_KEYS.followingCount(currentUserId) }); // Removed '!' - see onError explanation
        queryClient.invalidateQueries({ queryKey: FOLLOW_KEYS.isFollowing(currentUserId, variables) });
        queryClient.invalidateQueries({ queryKey: FOLLOW_KEYS.followersList(variables) });
        queryClient.invalidateQueries({ queryKey: FOLLOW_KEYS.followingList(currentUserId) }); // Removed '!'
        queryClient.invalidateQueries({ queryKey: ["posts", "following"] });
        queryClient.invalidateQueries({ queryKey: ["suggestedUsers"] });
      }
    },

    onError: (error, variables, context) => {
      console.error("Failed to follow user:", extractErrorMessage(error));

      if (context) {
        if (currentUserId) { // checagem para currentUserId
            if (context.previousFollowingCount !== undefined) {
              queryClient.setQueryData(FOLLOW_KEYS.followingCount(currentUserId), context.previousFollowingCount);
            }
            if (context.previousIsFollowing !== undefined) {
              queryClient.setQueryData(FOLLOW_KEYS.isFollowing(currentUserId, variables), context.previousIsFollowing);
            }
            // se previousSuggestedUsers estiver definido, restaura
            if (context.previousSuggestedUsers !== undefined) {
                queryClient.setQueryData(["suggestedUsers"], context.previousSuggestedUsers);
            }
        }

        if (context.previousFollowersCount !== undefined) {
            queryClient.setQueryData(FOLLOW_KEYS.followersCount(variables), context.previousFollowersCount);
        }
      }
    },
  });
}


/**
 * Hook para deixar de seguir um usuário.
 */
export function useUnfollowUser() {
  const queryClient = useQueryClient();
  const { data: currentUser } = useCurrentUserProfile(false);
  const currentUserId = currentUser?.id;

  type UnfollowData = { unfollowed: boolean; message: string; error?: string } | void;
  type UnfollowError = AxiosError<ApiError>;
  type UnfollowVariables = string; // targetUserId

  type UnfollowContext = {
    previousFollowersCount: number | undefined;
    previousFollowingCount: number | undefined;
    previousIsFollowing: boolean | undefined;
    previousSuggestedUsers: IUser[] | undefined;
  };

  return useMutation<UnfollowData, UnfollowError, UnfollowVariables, UnfollowContext>({
    mutationFn: deleteFollowUser,

    onMutate: async (targetUserId: string): Promise<UnfollowContext> => {
      if (!currentUserId) {
        throw new Error("User must be authenticated to unfollow others.");
      }

      await queryClient.cancelQueries({ queryKey: FOLLOW_KEYS.followersCount(targetUserId) });
      await queryClient.cancelQueries({ queryKey: FOLLOW_KEYS.followingCount(currentUserId) });
      await queryClient.cancelQueries({ queryKey: FOLLOW_KEYS.isFollowing(currentUserId, targetUserId) });
      await queryClient.cancelQueries({ queryKey: ["suggestedUsers"] });
      await queryClient.cancelQueries({ queryKey: ["posts", "following"] });

      const previousFollowersCount = queryClient.getQueryData<number>(FOLLOW_KEYS.followersCount(targetUserId));
      const previousFollowingCount = queryClient.getQueryData<number>(FOLLOW_KEYS.followingCount(currentUserId));
      const previousIsFollowing = queryClient.getQueryData<boolean>(FOLLOW_KEYS.isFollowing(currentUserId, targetUserId));
      const previousSuggestedUsers = queryClient.getQueryData<IUser[]>(["suggestedUsers"]);

      queryClient.setQueryData<number>(FOLLOW_KEYS.followingCount(currentUserId), (old) => Math.max(0, (old ?? 0) - 1));
      queryClient.setQueryData<number>(FOLLOW_KEYS.followersCount(targetUserId), (old) => Math.max(0, (old ?? 0) - 1));
      queryClient.setQueryData<boolean>(FOLLOW_KEYS.isFollowing(currentUserId, targetUserId), false);

      return { previousFollowersCount, previousFollowingCount, previousIsFollowing, previousSuggestedUsers };
    },

    onSuccess: (data, variables) => { // Removed 'context' parameter
      if (currentUserId) {
        console.log("User successfully unfollowed:", data);

        queryClient.invalidateQueries({ queryKey: FOLLOW_KEYS.followersCount(variables) });
        queryClient.invalidateQueries({ queryKey: FOLLOW_KEYS.followingCount(currentUserId) }); // Removed '!'
        queryClient.invalidateQueries({ queryKey: FOLLOW_KEYS.isFollowing(currentUserId, variables) });
        queryClient.invalidateQueries({ queryKey: FOLLOW_KEYS.followersList(variables) });
        queryClient.invalidateQueries({ queryKey: FOLLOW_KEYS.followingList(currentUserId) }); // Removed '!'
        queryClient.invalidateQueries({ queryKey: ["posts", "following"] });
        queryClient.invalidateQueries({ queryKey: ["suggestedUsers"] });
      }
    },

    onError: (error, variables, context) => { // 'context' é usado aqui para rollback
      console.error("Failed to unfollow user:", extractErrorMessage(error));

      if (context) {
        if (currentUserId) { // <-- Adição da checagem para currentUserId
            if (context.previousFollowingCount !== undefined) {
              queryClient.setQueryData(FOLLOW_KEYS.followingCount(currentUserId), context.previousFollowingCount);
            }
            if (context.previousIsFollowing !== undefined) {
              queryClient.setQueryData(FOLLOW_KEYS.isFollowing(currentUserId, variables), context.previousIsFollowing);
            }
            if (context.previousSuggestedUsers !== undefined) {
                queryClient.setQueryData(["suggestedUsers"], context.previousSuggestedUsers);
            }
        }
        if (context.previousFollowersCount !== undefined) {
            queryClient.setQueryData(FOLLOW_KEYS.followersCount(variables), context.previousFollowersCount);
        }
      }
    },
  });
}
