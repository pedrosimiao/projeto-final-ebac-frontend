// src/hooks/useUsers.ts

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { IUser } from "../types"; // Importa a interface IUser

import { ApiError, extractErrorMessage } from "../utils/apiErrorUtils"; // Funções de utilidade para erros

import {
  fetchCurrentUserRequest,
  updateCurrentUserProfileRequest,
  changePasswordRequest,
  deleteAccountRequest,
  UpdateProfilePayload, // interface do payload de atualização
  getUserByUsernameRequest,
  searchUsersForMentionRequest,
  getSuggestedUsersRequest,
} from "../api/userApi";



/**
 * Hook para buscar sugestões de usuários direto do backend.
 * O backend filtra, randomiza e retorna a lista de users sugeridos.
**/
export const useSuggestedUsers = () => {
  return useQuery<IUser[], string>({
    queryKey: ["suggestedUsers"],
    queryFn: async (): Promise<IUser[]> => {
      try {
        const users = await getSuggestedUsersRequest();
        return users;
      } catch (error) {
        if (error instanceof AxiosError) {
          throw new Error(
            extractErrorMessage(error as AxiosError<ApiError>) || "Failed to fetch suggested users."
          );
        }
        throw new Error("An unexpected error occurred while fetching suggested users.");
      }
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });
};


/**
 * Hook para busca de usuários na página Explore.
 * Mesmo endpoint de busca (criado para fins de separação semantica).
 */
export const useSearchUsers = (query: string) => {
  return useQuery<IUser[], Error>({
    queryKey: ["exploreSearchUsers", query], // queryKey único para esta busca
    queryFn: async (): Promise<IUser[]> => {
      if (!query) {
        return [];
      }
      try {
        // reuse busca com `?q=` e o limite de 10.
        const users = await searchUsersForMentionRequest(query);
        return users;
      } catch (error) {
        if (error instanceof AxiosError) {
          throw new Error(
            extractErrorMessage(error as AxiosError<ApiError>) || "Failed to search users."
          );
        }
        throw new Error("An unexpected error occurred while searching users.");
      }
    },
    enabled: !!query, // Ativa a query somente se houver um termo de busca
    staleTime: 1000 * 60 * 2, // Resultados da busca podem ser válidos por 2 minutos
    gcTime: 1000 * 60 * 5,   // Garbage collect após 5 minutos
    placeholderData: [], // Dados de placeholder vazios
  });
};


/**
 * Hook para buscar usuários especificamente para a funcionalidade de menção.
 */
export const useUsersForMention = (query: string) => {
  return useQuery<IUser[], string>({
    queryKey: ["usersForMention", query], // queryKey inclui a string de busca para cache

    queryFn: async (): Promise<IUser[]> => {
      if (!query) {
        return []; // array vazio se a query estiver vazia
      }
      try {
        const users = await searchUsersForMentionRequest(query);
        return users;
      } catch (error) {
        if (error instanceof AxiosError) {
          throw new Error(
            extractErrorMessage(error as AxiosError<ApiError>) || "Failed to search users for mention."
          );
        }
        throw new Error("An unexpected error occurred while searching users for mention.");
      }
    },

    enabled: !!query,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    placeholderData: [],
  });
};


/**
 * Hook para buscar sugestões de usuários especificamente para a funcionalidade de menção inicial (@).
 * Retorna usuários sugeridos/aleatórios quando a query de menção é vazia.
 * enable: true -->  hook sempre habilitado
 */
export const useInitialUsersForMentionSuggestion = () => {
  return useQuery<IUser[], string>({
    queryKey: ["initialUsersForMentionSuggestion"],
    queryFn: async (): Promise<IUser[]> => {
      try {
        const users = await getSuggestedUsersRequest();
        return users;
      } catch (error) {
        if (error instanceof AxiosError) {
          throw new Error(
            extractErrorMessage(error as AxiosError<ApiError>) ||
              "Failed to fetch initial suggested users for mention."
          );
        }
        throw new Error("An unexpected error occurred while fetching initial users for mention.");
      }
    },
    enabled: true,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    placeholderData: [],
  });
};


/**
 * Hook para buscar o perfil de um usuário específico pelo username.
 */
export const useUserByUsername = (username: string | undefined) => {
  return useQuery<IUser, string>({
    queryKey: ["userProfile", username],
    queryFn: async (): Promise<IUser> => {
      if (!username) {
        throw new Error("Username is required to fetch user profile.");
      }
      try {
        const user = await getUserByUsernameRequest(username);
        return user;
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.response?.status === 404) {
            throw new Error("User not found.");
          }
          throw new Error(extractErrorMessage(error as AxiosError<ApiError>) || "Failed to fetch user profile.");
        }
        throw new Error("An unexpected error occurred while fetching user profile.");
      }
    },

    enabled: !!username,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    retry: 1,
  });
};



/**
 * Hook para buscar o perfil do usuário logado (`/users/me/`)
 */
export const useCurrentUserProfile = (enabled: boolean = true) => {
  return useQuery<IUser, string>({
    queryKey: ["currentUser"],
    queryFn: async (): Promise<IUser> => {
      try {
        const user = await fetchCurrentUserRequest();
        return user;
      } catch (error) {
        if (error instanceof AxiosError) {
          throw new Error(
            extractErrorMessage(error as AxiosError<ApiError>) || "Erro ao buscar perfil do usuário"
          );
        }
        throw new Error("Ocorreu um erro inesperado ao buscar o perfil do usuário.");
      }
    },
    staleTime: 1000 * 60, // Perfil pode ser mais dinâmico, 1 minuto de staleTime
    gcTime: 1000 * 60 * 5, // 5 minutos de gcTime
    retry: 3, // Tenta refazer a requisição 3 vezes em caso de falha
    enabled: enabled, // A query só será executada se `enabled` for true (buscar dados condicionalmente após login)
  });
};



/**
 * Hook para atualizar o perfil do usuário.
 */
export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();

  return useMutation<Partial<IUser>, string, UpdateProfilePayload, { previousUserProfile: IUser | undefined }>({
    mutationFn: async (payload) => {
      try {
        const response = await updateCurrentUserProfileRequest(payload);
        return response.data;
      } catch (error) {
        if (error instanceof AxiosError) {
          throw new Error(extractErrorMessage(error as AxiosError<ApiError>) || "Falha ao atualizar perfil");
        }
        throw new Error("Ocorreu um erro inesperado ao atualizar o perfil.");
      }
    },
    onMutate: async (newProfileData) => {
      await queryClient.cancelQueries({ queryKey: ['currentUser'] });
      const previousUserProfile = queryClient.getQueryData<IUser>(['currentUser']);

      queryClient.setQueryData<IUser>(['currentUser'], (oldData) => {
        if (!oldData) return oldData;

        const optimisticUpdate: Partial<IUser> = {
          firstName: newProfileData.firstName,
          lastName: newProfileData.lastName,
          username: newProfileData.username,
          bio: newProfileData.bio,
          occupation: newProfileData.occupation,
          location: newProfileData.location,
          birth_date: newProfileData.birth_date,
        };

        return { ...oldData, ...optimisticUpdate };
      });

      return { previousUserProfile };
    },
    onSuccess: (data) => {
      queryClient.setQueryData<IUser>(['currentUser'], (oldData) => {
        if (!oldData) return data as IUser;
        return { ...oldData, ...data };
      });
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      console.log("Perfil atualizado com sucesso!", data);
    },
    onError: (err, newProfileData, context) => {
      console.error("Falha na atualização otimista, revertendo...", err, newProfileData);
      if (context?.previousUserProfile) {
        queryClient.setQueryData<IUser>(['currentUser'], context.previousUserProfile);
      }
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
  });
};



/**
 * Hook para mudar a senha do usuário.
 */
export const useChangePassword = () => {
  type ChangePasswordPayload = {
    currentPassword?: string;
    newPassword?: string;
    confirmNewPassword?: string;
  };

  return useMutation<string, string, ChangePasswordPayload>({
    mutationFn: async (payload: ChangePasswordPayload): Promise<string> => {
      try {
        const response = await changePasswordRequest(payload);
        return response.data.message; // Retorna a mensagem de sucesso
      } catch (error) {
        if (error instanceof AxiosError) {
          throw new Error(
            extractErrorMessage(error as AxiosError<ApiError>) || "Falha ao mudar a senha"
          );
        }
        throw new Error("Ocorreu um erro inesperado ao mudar a senha.");
      }
    },
    onSuccess: (message: string) => {
      console.log("Senha alterada com sucesso:", message);
      // Não há necessidade de invalidar `currentUser` aqui, a senha não é um dado visível do perfil
    },
    onError: (err: string) => {
      console.error("Erro ao mudar a senha:", err);
    },
  });
};



/**
 * Hook para deletar a conta do usuário.
 */
export const useDeleteAccount = () => {
  const queryClient = useQueryClient(); // Para limpar o cache após a exclusão

  type DeleteAccountPayload = { password?: string };

  return useMutation<string, string, DeleteAccountPayload>({
    mutationFn: async (payload: DeleteAccountPayload): Promise<string> => {
      try {
        const response = await deleteAccountRequest(payload);
        return response.data.message; // Retorna a mensagem de sucesso
      } catch (error) {
        if (error instanceof AxiosError) {
          throw new Error(
            extractErrorMessage(error as AxiosError<ApiError>) || "Failed to delete account"
          );
        }
        throw new Error("An unexpected error occurred while deleting account.");
      }
    },
    onSuccess: (message: string) => {
      console.log("Conta deletada com sucesso:", message);
      queryClient.clear();
    },
    onError: (err: string) => {
      console.error("Erro ao deletar conta:", err);
    },
  });
};
