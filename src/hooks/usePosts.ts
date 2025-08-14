// src/hooks/usePosts.ts

import { useSelector } from "react-redux";
import { AxiosError, AxiosResponse, InternalAxiosRequestConfig, AxiosHeaders } from "axios";

import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
  InfiniteData, // tipagem do cache de useInfiniteQuery
  UseInfiniteQueryOptions,
  UseQueryOptions
} from "@tanstack/react-query";

import {
  fetchPostsRequest,
  fetchPostByIdRequest,
  createPostRequest,
  fetchPostCountByUserIdRequest,
  deletePostRequest,
  fetchPostsByUserIdRequest,
  fetchFollowingPostsRequest,
} from "../api/postApi";

import { RootState } from "../store/store";

import { IPost, IPaginatedResponse } from "../types";

import { useCurrentUserProfile } from "./useUsers";

import { ApiError } from "../utils/apiErrorUtils";





// --- query keys de Posts ---
export const POST_KEYS = {
  // query key base
  all: ["posts"] as const,

  // query key para o feed infinito (PostList)
  lists: () => [...POST_KEYS.all, "list"] as const,

  // query key para busca de um único post por ID.
  detail: (postId: string) => [...POST_KEYS.all, "detail", postId] as const,

  // query key para busca da contagem de posts de um usuário específico.
  count: (userId: string) => [...POST_KEYS.all, "count", userId] as const,

  // query key para posts de usuário por ID com paginação.
  userPosts: (userId: string) => [...POST_KEYS.all, "user", userId, "posts"] as const,

  // query key para o feed de posts de usuários seguidos
  following: () => [...POST_KEYS.all, "following"] as const,
};




// --- QUERIES ---




/**
 * Hook para buscar posts para o feed principal com scroll infinito.
 */
export const useInfiniteFeedPosts = (
  options?: Omit<
    UseInfiniteQueryOptions<
      AxiosResponse<IPaginatedResponse<IPost[]>>,
      AxiosError<ApiError>,
      InfiniteData<AxiosResponse<IPaginatedResponse<IPost[]>>>,
      AxiosResponse<IPaginatedResponse<IPost[]>>,
      ReturnType<typeof POST_KEYS.lists>,
      string | undefined
    >,
    "queryKey" | "queryFn" | "getNextPageParam" | "initialPageParam"
  >
) => {
  type QueryFnData = AxiosResponse<IPaginatedResponse<IPost[]>>;
  type QueryError = AxiosError<ApiError>;
  type TransformedData = InfiniteData<QueryFnData>;
  type QueryKey = ReturnType<typeof POST_KEYS.lists>;
  type PageParam = string | undefined; // cursor: string | undefined inicialmente

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch,
  } = useInfiniteQuery<
    QueryFnData,
    QueryError,
    TransformedData,
    QueryKey,
    PageParam // cursor
  >({
    queryKey: POST_KEYS.lists(),

    queryFn: async ({ pageParam }) => {
      // pageParam = cursor da página anterior.
      // primeiro fetch ? pageParam = undefined (a.k.a. initialPageParam)
      return await fetchPostsRequest(pageParam); // passa o cursor para função de API
    },

    // encontrar o próximo cursor a partir da lastPage
    getNextPageParam: lastPage => {
      return lastPage.data.next || undefined;
    },

    initialPageParam: undefined,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    ...options
  });

  // page.data.results = array de IPost[] de cada página
  const allPosts = data?.pages?.flatMap(page => page.data.results) || [];

  return {
    posts: allPosts, // array achatado de todos os posts
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch,
    // data // case acesso direto a InfiniteData p/ mais controle
  };
};






/**
 * Hook para buscar posts de um usuário específico com paginação infinita.
 */
export const useInfiniteUserPosts = (
  userId?: string,

  options?: Omit<UseInfiniteQueryOptions<
    AxiosResponse<IPaginatedResponse<IPost[]>>,
    AxiosError<ApiError>,
    InfiniteData<AxiosResponse<IPaginatedResponse<IPost[]>>>,
    AxiosResponse<IPaginatedResponse<IPost[]>>,
    ReturnType<typeof POST_KEYS.userPosts>,
    string | undefined
  >, "queryKey" | "queryFn" | "getNextPageParam" | "initialPageParam">
) => {
  type QueryFnData = AxiosResponse<IPaginatedResponse<IPost[]>>;
  type QueryError = AxiosError<ApiError>;
  type TransformedData = InfiniteData<QueryFnData>;
  type QueryKey = ReturnType<typeof POST_KEYS.userPosts>;
  type PageParam = string | undefined; // cursor: string | undefined na primeira chamada

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch,
  } = useInfiniteQuery<QueryFnData, QueryError, TransformedData, QueryKey, PageParam>({
    queryKey: POST_KEYS.userPosts(userId || ""), // query posts de usuário

    queryFn: async ({ pageParam }) => {
      if (!userId) {
        throw new Error("User ID is required to fetch user posts.");
      }
      return await fetchPostsByUserIdRequest(userId, pageParam);
    },

    getNextPageParam: lastPage => {
      return lastPage.data.next || undefined;
    },

    initialPageParam: undefined,
    enabled: !!userId && (options?.enabled ?? true),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    ...options,
  });

  const allUserPosts = data?.pages?.flatMap(page => page.data.results) || [];

  return {
    posts: allUserPosts,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch,
  };
};






/**
 * Hook para buscar posts de usuários seguidos (feed "Following") com scroll infinito.
 */
export const useInfiniteFollowingPosts = (
  options?: Omit<
    UseInfiniteQueryOptions<
      AxiosResponse<IPaginatedResponse<IPost[]>>,
      AxiosError<ApiError>,
      InfiniteData<AxiosResponse<IPaginatedResponse<IPost[]>>>,
      AxiosResponse<IPaginatedResponse<IPost[]>>,
      ReturnType<typeof POST_KEYS.following>,
      string | undefined
    >,
    "queryKey" | "queryFn" | "getNextPageParam" | "initialPageParam"
  >
) => {
  type QueryFnData = AxiosResponse<IPaginatedResponse<IPost[]>>;
  type QueryError = AxiosError<ApiError>;
  type TransformedData = InfiniteData<QueryFnData>;
  type QueryKey = ReturnType<typeof POST_KEYS.following>;
  type PageParam = string | undefined;

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch,
  } = useInfiniteQuery<QueryFnData, QueryError, TransformedData, QueryKey, PageParam>({
    queryKey: POST_KEYS.following(),

    queryFn: async ({ pageParam }) => {
      return await fetchFollowingPostsRequest(pageParam);
    },

    getNextPageParam: lastPage => {
      return lastPage.data.next || undefined;
    },

    initialPageParam: undefined,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    ...options
  });

  const allFollowingPosts = data?.pages?.flatMap(page => page.data.results) || [];

  return {
    posts: allFollowingPosts,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch,
  };
};






/**
 * Hook para buscar um único post por ID.
 */
export const useSinglePost = (
  postId: string | undefined,
  options?: Omit<
    UseQueryOptions<
      AxiosResponse<IPost>,
      AxiosError<ApiError>,
      IPost,
      ReturnType<typeof POST_KEYS.detail>
    >,
    "queryKey" | "queryFn" | "select"
  >
) => {
  type SinglePostQueryKey = typeof POST_KEYS.detail;
  type SinglePostResponseData = AxiosResponse<IPost>;
  type SinglePostTransformedData = IPost;
  type SinglePostError = AxiosError<ApiError>;

  const { data, isLoading, isError, error, refetch } = useQuery<
    SinglePostResponseData,
    SinglePostError,
    SinglePostTransformedData,
    ReturnType<SinglePostQueryKey> // ReturnType para o tipo da chave
  >({
    // POST_KEYS.detail(postId: string) => ["posts", "detail", postId]
    // detail: (postId: string) => readonly ["posts", "detail", string]
    queryKey: POST_KEYS.detail(postId || ""),

    queryFn: async ({ queryKey }) => {
      const [, , targetPostId] = queryKey; // Alterado para pegar somente o terceiro elemento da chave (postId)
      if (!targetPostId) {
        throw new Error("Post ID is required to fetch a single post.");
      }
      return await fetchPostByIdRequest(targetPostId);
    },

    select: response => response.data, // ((data: SinglePostResponseData) => IPost) | undefined
    enabled: (options?.enabled ?? true) && !!postId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    ...options,
  });

  return { post: data, isLoading, isError, error, refetch };
};






/**
 * Hook para buscar a contagem de posts de um usuário.
 */
export const usePostCountByUserId = (
  userId: string | undefined,
  options?: Omit<
    UseQueryOptions<
      AxiosResponse<{ count: number }>,
      AxiosError<ApiError>,
      number,
      ReturnType<typeof POST_KEYS.count>
    >,
    "queryKey" | "queryFn" | "select"
  >
) => {
  type PostCountQueryKey = typeof POST_KEYS.count;
  type PostCountResponseData = AxiosResponse<{ count: number }>;
  type PostCountTransformedData = number;
  type PostCountError = AxiosError<ApiError>;

  const { data, isLoading, isError, error, refetch } = useQuery<
    PostCountResponseData,
    PostCountError,
    PostCountTransformedData,
    ReturnType<PostCountQueryKey> // Usa ReturnType para o tipo da chave
  >({
    //  POST_KEYS.count(userId: string) => ["posts", "count", userId].
    // count: (userId: string) => readonly ["posts", "count", string]
    queryKey: POST_KEYS.count(userId || ""),

    queryFn: async ({ queryKey }) => {
      const [, , targetUserId] = queryKey; // Alterado para pegar somente o terceiro elemento da chave (userId)
      if (!targetUserId) {
        throw new Error("User ID is required to fetch post count.");
      }
      return await fetchPostCountByUserIdRequest(targetUserId);
    },

    select: response => response.data.count, // ((data: PostCountResponseData) => number) | undefined
    enabled: (options?.enabled ?? true) && !!userId,
    staleTime: 5 * 60 * 1000,
    // contagem não precisa de atualização em tempo real constante.
    refetchOnWindowFocus: false,
    ...options,
  });

  return { postCount: data, isLoading, isError, error, refetch };
};





// --- MUTATIONS ---



/**
 * Hook para criar um novo post.
 */
export const useCreatePost = () => {
  const queryClient = useQueryClient();

  // pegando o id do usuário logado
  const { data: currentUser } = useCurrentUserProfile(false);
  const currentUserId = currentUser?.id;

  // post original que está sendo retuitado
  const retweetPost = useSelector((state: RootState) => state.retweet.targetPost);

  type CreatePostData = IPost;
  type CreatePostError = AxiosError<ApiError>;
  type CreatePostVariables = FormData;
  type CreatePostContext = {
    previousPosts: InfiniteData<AxiosResponse<IPaginatedResponse<IPost[]>>> | undefined;
    previousPostCount: number | undefined;
    previousUserPosts: InfiniteData<AxiosResponse<IPaginatedResponse<IPost[]>>> | undefined;
    previousFollowingPosts: InfiniteData<AxiosResponse<IPaginatedResponse<IPost[]>>> | undefined;
  };

  const { mutate, isPending, isError, error, isSuccess } = useMutation<
    CreatePostData,
    CreatePostError,
    CreatePostVariables, // FormData
    CreatePostContext
  >({
    mutationFn: async (formData: FormData) => {
      const response = await createPostRequest(formData);
      return response.data;
    },

    onMutate: async (newPostFormData: FormData): Promise<CreatePostContext> => {
      if (!currentUserId) {
        throw new Error("User must be authenticated to create a post.");
      }

      await queryClient.cancelQueries({ queryKey: POST_KEYS.lists() });
      await queryClient.cancelQueries({ queryKey: POST_KEYS.following() });

      if (currentUserId) {
        await queryClient.cancelQueries({ queryKey: POST_KEYS.count(currentUserId) });
        await queryClient.cancelQueries({ queryKey: POST_KEYS.userPosts(currentUserId) });
      }

      // snapshots do context atual no cache
      const previousPosts = queryClient.getQueryData<
        InfiniteData<AxiosResponse<IPaginatedResponse<IPost[]>>>
      >(POST_KEYS.lists());

      const previousFollowingPosts = queryClient.getQueryData<
        InfiniteData<AxiosResponse<IPaginatedResponse<IPost[]>>>
      >(POST_KEYS.following());

      const previousPostCount = queryClient.getQueryData<number>(POST_KEYS.count(currentUserId));

      const previousUserPosts = currentUserId
        ? queryClient.getQueryData<InfiniteData<AxiosResponse<IPaginatedResponse<IPost[]>>>>(
            POST_KEYS.userPosts(currentUserId)
          )
        : undefined;

      const tempPost: IPost = {
        id: `temp-${Date.now()}`, // ID temporário
        user: currentUser,
        content: newPostFormData.get("content") as string,

        // image ? cria um objeto url para exibição temporária até substituição pelos dados reais vindos do servidor
        image:
          newPostFormData.get("image") instanceof File
            ? URL.createObjectURL(newPostFormData.get("image") as File)
            : null,

        // video ? cria um objeto url para exibição temporária até substituição pelos dados reais vindos do servidor
        video:
          newPostFormData.get("video") instanceof File // Similar para vídeo
            ? URL.createObjectURL(newPostFormData.get("video") as File)
            : null,

        created_at: new Date().toISOString(),
        retweet: retweetPost || null,
        total_comments_count: 0,
      };

      // optimistic update para o feed principal ("For You")
      queryClient.setQueryData(
        POST_KEYS.lists(),
        (
          old: InfiniteData<AxiosResponse<IPaginatedResponse<IPost[]>>> | undefined
        ): InfiniteData<AxiosResponse<IPaginatedResponse<IPost[]>>> => {
          // cache = undefined? cria uma estrutura básica para o infinite query
          if (!old) {
            const mockHeaders = new AxiosHeaders();
            const mockConfig: InternalAxiosRequestConfig = { headers: mockHeaders };

            return {
              pages: [
                {
                  data: { results: [tempPost], next: null, previous: null },
                  status: 200,
                  statusText: "OK",
                  headers: mockHeaders,
                  config: mockConfig,
                  request: {},
                },
              ],
              pageParams: [undefined],
            };
          }

          // add tempPost na primeira página (post mais recente)
          const updatedPages = old.pages.map((page, index) => {
            if (index === 0) {
              // manipula a primeira página
              return {
                ...page,
                data: {
                  ...page.data,
                  results: [
                    tempPost,
                    ...page.data.results.filter(
                      p => !p.id.startsWith("temp-") && p.id !== tempPost.id
                    ),
                  ],
                },
              };
            }
            return page;
          });

          return { ...old, pages: updatedPages };
        }
      );

      // optimistic update para o feed "Following"
      queryClient.setQueryData(
        POST_KEYS.following(),
        (
          oldFollowing: InfiniteData<AxiosResponse<IPaginatedResponse<IPost[]>>> | undefined
        ): InfiniteData<AxiosResponse<IPaginatedResponse<IPost[]>>> => {
          if (!oldFollowing) {
            const mockHeaders = new AxiosHeaders();
            const mockConfig: InternalAxiosRequestConfig = { headers: mockHeaders };
            return {
              pages: [
                {
                  data: { results: [tempPost], next: null, previous: null },
                  status: 200,
                  statusText: "OK",
                  headers: mockHeaders,
                  config: mockConfig,
                  request: {},
                },
              ],
              pageParams: [undefined],
            };
          }
          const updatedFollowingPages = oldFollowing.pages.map((page, index) => {
            if (index === 0) {
              return {
                ...page,
                data: {
                  ...page.data,
                  results: [
                    tempPost,
                    ...page.data.results.filter(
                      p => !p.id.startsWith("temp-") && p.id !== tempPost.id
                    ),
                  ],
                },
              };
            }
            return page;
          });
          return { ...oldFollowing, pages: updatedFollowingPages };
        }
      );

      // optimistic update do cache de posts currentUser
      if (currentUserId) {
        queryClient.setQueryData(
          POST_KEYS.userPosts(currentUserId),
          (
            oldUserPosts: InfiniteData<AxiosResponse<IPaginatedResponse<IPost[]>>> | undefined
          ): InfiniteData<AxiosResponse<IPaginatedResponse<IPost[]>>> => {
            const userSpecificTempPost: IPost = {
              ...tempPost,
              id: `temp-${Date.now()}-user`, // temp id diferente para evitar conflitos
            };

            if (!oldUserPosts) {
              const mockHeaders = new AxiosHeaders();
              const mockConfig: InternalAxiosRequestConfig = { headers: mockHeaders };
              return {
                pages: [
                  {
                    data: { results: [userSpecificTempPost], next: null, previous: null },
                    status: 200,
                    statusText: "OK",
                    headers: mockHeaders,
                    config: mockConfig,
                    request: {},
                  },
                ],
                pageParams: [undefined],
              };
            }
            const updatedUserPages = oldUserPosts.pages.map((page, index) => {
              if (index === 0) {
                return {
                  ...page,
                  data: {
                    ...page.data,
                    results: [
                      userSpecificTempPost,
                      ...page.data.results.filter(
                        p => !p.id.startsWith("temp-") && p.id !== userSpecificTempPost.id
                      ),
                    ],
                  },
                };
              }
              return page;
            });
            return { ...oldUserPosts, pages: updatedUserPages };
          }
        );
      }

      // optimistic update do count de posts do currentUser.
      queryClient.setQueryData(POST_KEYS.count(currentUserId), (old: number | undefined) =>
        old !== undefined ? old + 1 : 1
      );

      // retorno snapshot para context do onError (case rollback)
      return { previousPosts, previousPostCount, previousUserPosts, previousFollowingPosts };
    },


    onSuccess: (newPostFromApi: IPost) => {
      // substituição do post temp pelo post real da API em qualquer feed
      const updateFeed = (
        old: InfiniteData<AxiosResponse<IPaginatedResponse<IPost[]>>> | undefined
      ): InfiniteData<AxiosResponse<IPaginatedResponse<IPost[]>>> => {
        if (!old) {
          const mockHeaders = new AxiosHeaders();
          const mockConfig: InternalAxiosRequestConfig = { headers: mockHeaders };

          return {
            pages: [
              {
                data: { results: [newPostFromApi], next: null, previous: null },
                status: 200,
                statusText: "OK",
                headers: mockHeaders,
                config: mockConfig,
                request: {},
              },
            ],
            pageParams: [undefined],
          };
        }

        const updatedPages = old.pages.map((page, index) => {
          if (index === 0) {
            const updatedResults = page.data.results
              .map(post =>
                post.id.startsWith("temp-") && post.user?.id === newPostFromApi.user?.id
                  ? newPostFromApi // swap temp post to real post
                  : post
              )
              // removendo outros possíveis temp posts remanescentes
              .filter(post => !post.id.startsWith("temp-") || post.id === newPostFromApi.id);

            if (!updatedResults.some(post => post.id === newPostFromApi.id)) {
              return {
                ...page,
                data: { ...page.data, results: [newPostFromApi, ...updatedResults] },
              };
            }
            return { ...page, data: { ...page.data, results: updatedResults } };
          }
          return page;
        });

        return { ...old, pages: updatedPages };
      };

      // optimistic update todos os feeds relevantes
      queryClient.setQueryData(POST_KEYS.lists(), updateFeed);
      if (currentUserId) {
        queryClient.setQueryData(POST_KEYS.userPosts(currentUserId), updateFeed);
        queryClient.setQueryData(POST_KEYS.following(), updateFeed); // update feed following
      }

      // invalidação de queries relevantes
      queryClient.invalidateQueries({ queryKey: POST_KEYS.lists() });
      if (currentUserId) {
        queryClient.invalidateQueries({ queryKey: POST_KEYS.count(currentUserId) });
        queryClient.invalidateQueries({ queryKey: POST_KEYS.userPosts(currentUserId) });
        queryClient.invalidateQueries({ queryKey: POST_KEYS.following() });
      }
      console.log("Post created:", newPostFromApi);
    },


    onError: (error, _variables, context) => {
      console.error("Falha ao criar post:", error);
      // rollback dos caches em caso de erro
      if (context?.previousPosts) {
        queryClient.setQueryData(POST_KEYS.lists(), context.previousPosts);
      }
      if (currentUserId && context?.previousPostCount !== undefined) {
        queryClient.setQueryData(POST_KEYS.count(currentUserId), context.previousPostCount);
      }
      if (currentUserId && context?.previousUserPosts) {
        queryClient.setQueryData(POST_KEYS.userPosts(currentUserId), context.previousUserPosts);
      }
      if (currentUserId && context?.previousFollowingPosts) {
        // rollback para o feed 'following'
        queryClient.setQueryData(POST_KEYS.following(), context.previousFollowingPosts);
      }
    },
  });

  return { createPost: mutate, isLoading: isPending, isError, error, isSuccess };
};








/**
 * Hook para deletar um post.
 */
export const useDeletePost = () => {
  const queryClient = useQueryClient();
  const { data: currentUser } = useCurrentUserProfile(false);
  const currentUserId = currentUser?.id;

  type DeletePostData = void;
  type DeletePostError = AxiosError<ApiError>;
  type DeletePostVariables = string; // postId
  type DeletePostContext = {
    previousPosts: InfiniteData<AxiosResponse<IPaginatedResponse<IPost[]>>> | undefined;
    previousSinglePost: IPost | undefined;
    previousPostCount: number | undefined;
    previousUserPosts: InfiniteData<AxiosResponse<IPaginatedResponse<IPost[]>>> | undefined;
    previousFollowingPosts: InfiniteData<AxiosResponse<IPaginatedResponse<IPost[]>>> | undefined; // Adicionado
  };

  const { mutate, isPending, isError, error, isSuccess } = useMutation<
    DeletePostData,
    DeletePostError,
    DeletePostVariables, // postId
    DeletePostContext
  >({
    mutationFn: async (postId: string) => {
      await deletePostRequest(postId);
    },

    onMutate: async (postIdToDelete: string): Promise<DeletePostContext> => {
      await queryClient.cancelQueries({ queryKey: POST_KEYS.lists() });
      await queryClient.cancelQueries({ queryKey: POST_KEYS.detail(postIdToDelete) });
      await queryClient.cancelQueries({ queryKey: POST_KEYS.following() }); // Cancela a query de following posts

      if (currentUserId) {
        await queryClient.cancelQueries({ queryKey: POST_KEYS.count(currentUserId) });
        await queryClient.cancelQueries({ queryKey: POST_KEYS.userPosts(currentUserId) });
      }

      // snapshot do estado atual do cache
      const previousPosts = queryClient.getQueryData<
        InfiniteData<AxiosResponse<IPaginatedResponse<IPost[]>>>
      >(POST_KEYS.lists());

      const previousSinglePost = queryClient.getQueryData<IPost>(POST_KEYS.detail(postIdToDelete));

      const previousFollowingPosts = queryClient.getQueryData<
        InfiniteData<AxiosResponse<IPaginatedResponse<IPost[]>>>
      >(POST_KEYS.following());

      const previousPostCount = currentUserId
        ? queryClient.getQueryData<number>(POST_KEYS.count(currentUserId))
        : undefined;

      const previousUserPosts = currentUserId
        ? queryClient.getQueryData<InfiniteData<AxiosResponse<IPaginatedResponse<IPost[]>>>>(
            POST_KEYS.userPosts(currentUserId)
          )
        : undefined;

      // optimistic update para todos os feeds (remove o post)
      const filterPost = (
        old: InfiniteData<AxiosResponse<IPaginatedResponse<IPost[]>>> | undefined
      ): InfiniteData<AxiosResponse<IPaginatedResponse<IPost[]>>> => {
        if (!old) return { pages: [], pageParams: [] };
        const updatedPages = old.pages.map(page => ({
          ...page,
          data: {
            ...page.data,
            results: page.data.results.filter(post => post.id !== postIdToDelete),
          },
        }));
        return { ...old, pages: updatedPages };
      };

      queryClient.setQueryData(POST_KEYS.lists(), filterPost);
      queryClient.setQueryData(POST_KEYS.detail(postIdToDelete), undefined);
      if (currentUserId) {
        queryClient.setQueryData(POST_KEYS.userPosts(currentUserId), filterPost);
        queryClient.setQueryData(POST_KEYS.following(), filterPost); // Remove do feed 'following'
      }

      // Atualiza a contagem de posts do usuário otimisticamente.
      if (currentUserId && previousPostCount !== undefined && previousPostCount > 0) {
        queryClient.setQueryData(POST_KEYS.count(currentUserId), (old: number | undefined) =>
          old !== undefined && old > 0 ? old - 1 : 0
        );
      }

      return {
        previousPosts,
        previousSinglePost,
        previousPostCount,
        previousUserPosts,
        previousFollowingPosts,
      };
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: POST_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: POST_KEYS.all });
      if (currentUserId) {
        queryClient.invalidateQueries({ queryKey: POST_KEYS.following() });
        queryClient.invalidateQueries({ queryKey: POST_KEYS.userPosts(currentUserId) });
        queryClient.invalidateQueries({ queryKey: POST_KEYS.count(currentUserId) });
      }
      console.log("Post deleted.");
    },

    onError: (error, variables, context) => {
      console.error("Failed to delete post:", error);
      // rollback caches em caso de erro
      if (context?.previousPosts) {
        queryClient.setQueryData(POST_KEYS.lists(), context.previousPosts);
      }
      if (context?.previousSinglePost) {
        queryClient.setQueryData(
          POST_KEYS.detail(variables), // variables = postId aqui.
          context.previousSinglePost
        );
      }
      if (currentUserId && context?.previousPostCount !== undefined) {
        queryClient.setQueryData(POST_KEYS.count(currentUserId), context.previousPostCount);
      }
      if (currentUserId && context?.previousUserPosts) {
        queryClient.setQueryData(POST_KEYS.userPosts(currentUserId), context.previousUserPosts);
      }
      if (currentUserId && context?.previousFollowingPosts) {
        // rollback para o feed 'following'
        queryClient.setQueryData(POST_KEYS.following(), context.previousFollowingPosts);
      }
    },
  });

  return { deletePost: mutate, isLoading: isPending, isError, error, isSuccess };
};
