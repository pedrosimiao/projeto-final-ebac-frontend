// src/hooks/useNotifications.ts

import { useMutation, useQueryClient, useInfiniteQuery, InfiniteData } from '@tanstack/react-query';
import { fetchNotificationsAPI, markAllNotificationsAsReadAPI } from '../api/notificationApi';
import { INotification, IPaginatedResponse } from '../types';

const NOTIFICATIONS_QUERY_KEY = ['notifications'];

export const useNotifications = () => {
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<
    IPaginatedResponse<INotification[]>,
    Error,
    INotification[],
    string[],
    string | undefined
  >({
    queryKey: NOTIFICATIONS_QUERY_KEY,

    queryFn: async ({ pageParam }) => {
      return fetchNotificationsAPI(pageParam as string | undefined);
    },

    getNextPageParam: lastPage => {
      return lastPage.next || undefined;
    },

    initialPageParam: undefined,

    select: (infiniteData): INotification[] => {
      return infiniteData.pages.flatMap(page => page.results);
    },

    refetchInterval: 150_000,
    refetchOnWindowFocus: true,
    staleTime: 60_000,
    gcTime: 300_000,
  });

  const notifications = data || [];

  const markAllAsReadMutation = useMutation<void, Error, void>({
    mutationFn: markAllNotificationsAsReadAPI,

    onSuccess: () => {
      console.log("Mutation SUCCESS: Marking notifications as read in cache.");

      queryClient.setQueryData(
        NOTIFICATIONS_QUERY_KEY,
        (oldInfiniteData: InfiniteData<IPaginatedResponse<INotification[]>> | undefined) => {
          if (!oldInfiniteData || !oldInfiniteData.pages) {
            console.log("No old notifications found in cache to mark as read.");
            return { pages: [], pageParams: [] };
          }

          const updatedPages = oldInfiniteData.pages.map(page => ({
            ...page,
            results: page.results.map(n => ({ ...n, isRead: true })),
          }));

          console.log("Cache updated with all notifications marked as read.");
          return { ...oldInfiniteData, pages: updatedPages };
        }
      );
    },

    onError: err => {
      console.error("Failed to mark all notifications as read (mutation error):", err);
    },
  });

  return {
    notifications,
    isLoading,
    isError,
    error,
    refetch,
    markAllAsRead: markAllAsReadMutation.mutate,
    isMarkingAsRead: markAllAsReadMutation.isPending,
    markAllAsReadError: markAllAsReadMutation.error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
};
