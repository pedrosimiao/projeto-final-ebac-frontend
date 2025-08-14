// src/api/hashtagApi.ts

import { AxiosError } from "axios";
import apiClient from "./apiClient";
import { extractErrorMessage, ApiError } from "../utils/apiErrorUtils";

export interface IHashtag {
  id: number;
  name: string;
  created_at: string;
}

export const searchHashtagsRequest = async (query: string): Promise<IHashtag[]> => {
  try {
    // /api/hashtags/busca via parâmetro 'search'
    const response = await apiClient.get<IHashtag[]>(`/hashtags/?search=${query}`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const message = extractErrorMessage(error as AxiosError<ApiError>);
      console.error(`Error searching hashtags with query "${query}":`, message);
      throw error;
    }
    throw error;
  }
};

export const fetchRandomTrendsRequest = async (limit: number = 5): Promise<IHashtag[]> => {
    try {
        const response = await apiClient.get<IHashtag[]>(`/hashtags/random_trends/?limit=${limit}`);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            const message = extractErrorMessage(error as AxiosError<ApiError>);
            console.error(`Error fetching random trends with limit "${limit}":`, message);
            throw error;
        }
        throw error;
    }
};
