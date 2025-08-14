// src/hooks/useHashtags.ts

import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { IHashtag, searchHashtagsRequest, fetchRandomTrendsRequest } from "../api/hashtagApi";
import { ApiError, extractErrorMessage } from "../utils/apiErrorUtils";

export const HASHTAG_KEYS = {
  all: ["hashtags"] as const,
  search: (query: string) => [...HASHTAG_KEYS.all, "search", query] as const,
  random: (limit: number) => [...HASHTAG_KEYS.all, "random", limit] as const,
  exploreSearch: (query: string) => [...HASHTAG_KEYS.all, "exploreSearch", query] as const,
};

export const useHashtagsForMention = (query: string) => {
  return useQuery<IHashtag[], string>({
    queryKey: HASHTAG_KEYS.search(query),
    queryFn: async (): Promise<IHashtag[]> => {
      if (!query) {
        return [];
      }
      try {
        const hashtags = await searchHashtagsRequest(query);
        return hashtags;
      } catch (error) {
        if (error instanceof AxiosError) {
          throw new Error(
            extractErrorMessage(error as AxiosError<ApiError>) || "Failed to search hashtags."
          );
        }
        throw new Error("An unexpected error occurred while searching hashtags.");
      }
    },
    enabled: !!query,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    placeholderData: [],
  });
};

export const useRandomHashtags = (limit: number = 5) => {
  return useQuery<IHashtag[], Error>({
    queryKey: HASHTAG_KEYS.random(limit),
    queryFn: async () => {
      try {
        const hashtags = await fetchRandomTrendsRequest(limit);
        return hashtags;
      } catch (error) {
        if (error instanceof AxiosError) {
          throw new Error(
            extractErrorMessage(error as AxiosError<ApiError>) || "Failed to fetch random trends."
          );
        }
        throw new Error("An unexpected error occurred while fetching random trends.");
      }
    },

    staleTime: 1000 * 60 * 15,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
};


export const useSearchHashtags = (query: string) => {
  return useQuery<IHashtag[], Error>({
    queryKey: HASHTAG_KEYS.exploreSearch(query),
    queryFn: async (): Promise<IHashtag[]> => {
      if (!query) {
        return [];
      }
      try {
        const hashtags = await searchHashtagsRequest(query);
        return hashtags;
      } catch (error) {
        if (error instanceof AxiosError) {
          throw new Error(
            extractErrorMessage(error as AxiosError<ApiError>) || "Failed to search hashtags."
          );
        }
        throw new Error("An unexpected error occurred while searching hashtags.");
      }
    },
    enabled: !!query,
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5,
    placeholderData: [],
  });
};


export const useInitialHashtagsForMentionSuggestion = (limit: number = 10) => {
  return useQuery<IHashtag[], string>({
    queryKey: HASHTAG_KEYS.random(limit), // Reutiliza a chave de random para o cache
    queryFn: async (): Promise<IHashtag[]> => {
      try {
        const hashtags = await fetchRandomTrendsRequest(limit); // Busca as trends
        return hashtags;
      } catch (error) {
        if (error instanceof AxiosError) {
          throw new Error(
            extractErrorMessage(error as AxiosError<ApiError>) ||
              "Failed to fetch initial suggested hashtags for mention."
          );
        }
        throw new Error("An unexpected error occurred while fetching initial hashtags for mention.");
      }
    },
    enabled: true,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    placeholderData: [],
  });
};
