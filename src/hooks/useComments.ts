// src/hooks/useComments.ts

import {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
  AxiosHeaders
} from "axios";

import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
  InfiniteData, // tipagem p/ InfinieQuery
} from "@tanstack/react-query";

import {
  IComment,
  IPaginatedResponse,
  IUser
} from "../types"; // IUser p/ o mock de parent_comment

import {
  fetchRootCommentsRequest, // busca de comment raiz
  fetchCommentByIdRequest, // busca um único comment por id
  createCommentRequest, // criar um comment
  deleteCommentRequest, // deletar um comment
  fetchRepliesToCommentRequest, // buscar lista de replies de um comment
} from "../api/commentApi";

import { useCurrentUserProfile } from "./useUsers";
import { ApiError } from "../utils/apiErrorUtils";
import { isTempId } from "../utils/idUtils";





// --- query keys de comments ---
export const COMMENT_KEYS = {
  all: ["comments"] as const, // chave genérica para todos os comentários

  // comentários raiz de um post, lista de comment que não são replies à um comment
  rootList: (postId: string) => [...COMMENT_KEYS.all, "rootList", postId] as const,

  // respostas de um comentário pai, lista de comments que são replies a um comment
  repliesList: (parentCommentId: string) =>
    [...COMMENT_KEYS.all, "repliesList", parentCommentId] as const,

  // único comentário (incluindo suas respostas aninhadas), detalhes de um comment específico
  detail: (commentId: string) => [...COMMENT_KEYS.all, "detail", commentId] as const,
};





// --- QUERIES ---






/**
 * Hook para buscar comentários raiz (paginação infinita)
 */
export const useInfiniteRootComments = (postId: string | undefined) => {
  type QueryFnData = AxiosResponse<IPaginatedResponse<IComment[]>>; // dados retornados pela função de query (resposta Axios com paginação de comentários)
  type QueryError = AxiosError<ApiError>; // tipo de erro esperado (customizado apiErrorUtils)
  type CachedDataStructure = InfiniteData<QueryFnData>; // tipagem com a qual TanStack Query armazena dados de queries infinitas
  type QueryKey = ReturnType<typeof COMMENT_KEYS.rootList>; // tipo inferido da chave de query
  type PageParam = string | undefined; // tipo do parâmetro de página (cursor "next" ou "previous")

  const {
    data, // dados cacheados e transformados
    fetchNextPage, // carregar a próxima página
    hasNextPage, // checar por mais páginas para carregar
    isFetchingNextPage, // checar se a próxima página está sendo carregada
    isLoading, // checar se a query inicial está carregando
    isError, // checagem de erro
    error, // objeto de erro
    refetch, // refetch manual
  } = useInfiniteQuery<
    QueryFnData,
    QueryError,
    CachedDataStructure,
    QueryKey,
    PageParam
  >({
    queryKey: COMMENT_KEYS.rootList(postId || ""),

    // requisição de dados
    queryFn: async ({ pageParam }) => {
      if (!postId) {
        throw new Error("Post ID required to fetch root commments.");
      }
      // função da API para buscar comentários raiz com o cursor da próxima página.
      return await fetchRootCommentsRequest(postId, pageParam);
    },

    // lógica para determinar o próximo `pageParam`
    getNextPageParam: lastPage => {
      return lastPage.data.next || undefined;
    },
    initialPageParam: undefined, // valor inicial do pageParam para a primeira requisição.
    enabled: !!postId, // query executa se postId === true && !null && !undefined
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });

  // todas as páginas de resultados são achatadas em um único array de comentários
  const allRootComments = data?.pages?.flatMap(page => page.data.results) || [];

  return {
    rootComments: allRootComments, // Array de todos os comentários raiz
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
 * Hook para buscar replies à um parent_comment (paginação infinita)
 */
export const useInfiniteRepliesToComment = (parentCommentId: string | undefined) => {
  type QueryFnData = AxiosResponse<IPaginatedResponse<IComment[]>>;
  type QueryError = AxiosError<ApiError>;
  type CachedDataStructure = InfiniteData<QueryFnData>;
  type QueryKey = ReturnType<typeof COMMENT_KEYS.repliesList>;
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
  } = useInfiniteQuery<QueryFnData, QueryError, CachedDataStructure, QueryKey, PageParam>({
    queryKey: COMMENT_KEYS.repliesList(parentCommentId || ""),

    queryFn: async ({ pageParam }) => {
      if (!parentCommentId) {
        throw new Error("Parent comment ID is required to fetch replies.");
      }
      return await fetchRepliesToCommentRequest(parentCommentId, pageParam);
    },

    getNextPageParam: lastPage => {
      return lastPage.data.next || undefined;
    },

    initialPageParam: undefined,
    enabled: !!parentCommentId, // query executa se parentCommentId === true && !null && !undefined
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });

  // todas as páginas de resultados (replies à um comment) são achatadas em um único array de comentários
  const allReplies = data?.pages?.flatMap(page => page.data.results) || [];

  return {
    replies: allReplies,
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
 * Hook para buscar um único comentário por ID, incluindo respostas aninhadas.
 */
export const useSingleComment = (commentId: string | undefined) => {
  type SingleCommentQueryKey = ReturnType<typeof COMMENT_KEYS.detail>;
  type SingleCommentResponseData = AxiosResponse<IComment>; // <-- Este é o tipo esperado para o retorno do queryFn
  type SingleCommentTransformedData = IComment; // <-- Este é o tipo do 'data' final após o 'select'
  type SingleCommentError = AxiosError<ApiError>;

  const { data, isLoading, isError, error, refetch } = useQuery<
    SingleCommentResponseData,
    SingleCommentError,
    SingleCommentTransformedData, // Tipo de dado após 'select'
    SingleCommentQueryKey
  >({
    queryKey: COMMENT_KEYS.detail(commentId || ""),

    queryFn: async ({ queryKey }) => {
      const [, , currentCommentId] = queryKey;
      if (!currentCommentId) {
        throw new Error("Comment ID required to fetch single comment.");
      }

      // MOCK DE AXIOSRESPONSE
      if (isTempId(currentCommentId)) {
        console.warn(`useSingleComment: Skipping API call for temporary ID: ${currentCommentId}`);
        // retorna um objeto que simulando uma AxiosResponse<IComment>
        // data: IComment
        // status, headers, etc.: mocks.
        const mockHeaders = new AxiosHeaders();
        const mockConfig: InternalAxiosRequestConfig = { headers: mockHeaders };

        return {
          data: {
            // <<< O OBJETO IComment REAL VAI AQUI, DENTRO DE 'data'
            id: currentCommentId,
            user: {} as IUser, // Mock, pode ser melhorado
            post_id: "", // Mock
            content: "temp...", // Mock
            image: null,
            video: null,
            created_at: new Date().toISOString(),
            comments: [],
            reply_count: 0,
            parent_comment: null,
          } as IComment,

          status: 200, // Status HTTP
          statusText: "OK (Mocked)", // Texto do status
          headers: mockHeaders, // Headers mockados
          config: mockConfig, // Configuração mockada
          request: {}, // Objeto de requisição mockado
        } as AxiosResponse<IComment>; // Casting para garantir o tipo completo
      }

      // Se não for um ID temporário, faz a requisição normal
      return await fetchCommentByIdRequest(currentCommentId);
    },
    // O 'select' é importante porque ele transforma AxiosResponse<IComment> em IComment
    select: response => response.data,
    enabled: !!commentId && !isTempId(commentId),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });

  return { singleComment: data, isLoading, isError, error, refetch };
};








// --- MUTATIONS ---






/**
 * Hook para criar um novo comentário ou resposta.
 */
export const useCreateComment = () => {
  const queryClient = useQueryClient(); // instância do QueryClient para interagir com o cache
  const { data: currentUser } = useCurrentUserProfile(false); // dados do usuário logado para o temComment (opmtimistic update)

  // tipos para os dados retornados, erros, variáveis de mutação e context do onMutate
  type CreateCommentData = IComment;
  type CreateCommentError = AxiosError<ApiError>;
  type CreateCommentVariables = FormData; // variáveis de entrada para a mutação (FormData para arquivos e campos)
  type CreateCommentContext = {
    previousRootComments: InfiniteData<AxiosResponse<IPaginatedResponse<IComment[]>>> | undefined;
    previousReplies: InfiniteData<AxiosResponse<IPaginatedResponse<IComment[]>>> | undefined;
    previousSingleComment: IComment | undefined;
    optimisticCommentId: string;
  };


  const { mutate, isPending, isError, error, isSuccess } = useMutation<
    CreateCommentData,
    CreateCommentError,
    CreateCommentVariables,
    CreateCommentContext
  >({
    mutationFn: createCommentRequest, // A função de requisição HTTP real (definida em commentApi.ts)

    onMutate: async (newCommentFormData: FormData): Promise<CreateCommentContext> => {
      // onMutate é chamado antes da mutação ser enviada ao servidor
      // optimistic update
      const postId = newCommentFormData.get("post") as string | null; // 'post' para o campo de FK do model comment.py
      const parentCommentId = newCommentFormData.get("parent_comment") as string | null; // parent_comment' para o campo de FK do model comment.py
      const content = newCommentFormData.get("content") as string;
      const imageFile = newCommentFormData.get("image") as File | null;
      const videoFile = newCommentFormData.get("video") as File | null;

      if (!currentUser?.id) {
        throw new Error("User must be authenticated to create comment.");
      }
      if (!postId) {
        throw new Error("Post ID is necessary to crrate comment.");
      }

      // cancelar queries, evitar refetch desnecessário
      await queryClient.cancelQueries({ queryKey: COMMENT_KEYS.rootList(postId) });
      if (parentCommentId) {
        await queryClient.cancelQueries({ queryKey: COMMENT_KEYS.repliesList(parentCommentId) });
        await queryClient.cancelQueries({ queryKey: COMMENT_KEYS.detail(parentCommentId) });
      }

      // snapshots do cache para rollback
      const previousRootComments = queryClient.getQueryData<
        InfiniteData<AxiosResponse<IPaginatedResponse<IComment[]>>>
      >(COMMENT_KEYS.rootList(postId));

      const previousReplies = parentCommentId
        ? queryClient.getQueryData<InfiniteData<AxiosResponse<IPaginatedResponse<IComment[]>>>>(
            COMMENT_KEYS.repliesList(parentCommentId)
          )
        : undefined;

      const previousSingleComment = parentCommentId
        ? queryClient.getQueryData<IComment>(COMMENT_KEYS.detail(parentCommentId))
        : undefined;

      // Try to get the actual parent comment from the cache if it's a reply
      const actualParentComment = parentCommentId
        ? queryClient.getQueryData<IComment>(COMMENT_KEYS.detail(parentCommentId))
        : undefined;

      // Cria um ID temporário único para o comentário otimista
      const optimisticCommentId = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Cria um comentário temporário pro 'optimistic update'
      const tempComment: IComment = {
        id: optimisticCommentId,
        user: currentUser, // infos do usuário logado (IUser retornado por useCurrentUserProfile)
        post_id: postId, // interface IComment espera 'post_id'

        parent_comment: parentCommentId
          ? actualParentComment || {
              // actualParentComment if available, else mock
              id: parentCommentId,
              user: {} as IUser,
              post_id: postId,
              content: "...",
              created_at: "",
              comments: [],
              reply_count: 0,
              parent_comment: null,
            }
          : null,

        content: content,
        image: imageFile ? URL.createObjectURL(imageFile) : null, // URL temporária para visualização da imagem/vídeo
        video: videoFile ? URL.createObjectURL(videoFile) : null,
        created_at: new Date().toISOString(),
        comments: [], // Sem respostas aninhadas no comentário temporário para simplificar
        reply_count: 0, // Inicia com 0 para o temporário
      };

      // optimistic update: adiciona o comentário/reply ao cache apropriado
      if (!parentCommentId) {
        // não havendo parent_comment então é "comentário raiz" (reply à um post)
        queryClient.setQueryData(
          COMMENT_KEYS.rootList(postId),
          (
            old: InfiniteData<AxiosResponse<IPaginatedResponse<IComment[]>>> | undefined
          ): InfiniteData<AxiosResponse<IPaginatedResponse<IComment[]>>> => {
            if (!old) {
              // se não houver dados antigos, cria uma estrutura paginada mínima com o tempComment
              const mockHeaders = new AxiosHeaders();
              const mockConfig: InternalAxiosRequestConfig = { headers: mockHeaders };
              return {
                pages: [
                  {
                    data: { results: [tempComment], next: null, previous: null },
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
                // adicionando o tempComment no início da primeira página de reply a um post
                return {
                  ...page,
                  data: {
                    ...page.data,
                    results: [
                      tempComment,
                      // filtra qualquer outro tempComment existente para evitar duplicatas otimistas.
                      ...page.data.results.filter((c) => !isTempId(c.id)),
                    ],
                  },
                };
              }
              return page;
            });
            return { ...old, pages: updatedPages };
          }
        );
      } else {
        // else = é uma resposta a um comentário existente
        // atualiza a lista de replies ao parent_comment
        queryClient.setQueryData(
          COMMENT_KEYS.repliesList(parentCommentId),
          (
            old: InfiniteData<AxiosResponse<IPaginatedResponse<IComment[]>>> | undefined
          ): InfiniteData<AxiosResponse<IPaginatedResponse<IComment[]>>> => {
            if (!old) {
              // se não houver dados antigos, cria uma estrutura paginada mínima com o tempComment
              const mockHeaders = new AxiosHeaders();
              const mockConfig: InternalAxiosRequestConfig = { headers: mockHeaders };
              return {
                pages: [
                  {
                    data: { results: [tempComment], next: null, previous: null },
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
                // adicionando o tempComment no início da primeira página de replies à um comment
                return {
                  ...page,
                  data: {
                    ...page.data,
                    results: [
                      tempComment,
                      // filtra qualquer outro tempComment existente para evitar duplicatas otimistas.
                      ...page.data.results.filter(c => !isTempId(c.id)),
                    ],
                  },
                };
              }
              return page;
            });
            return { ...old, pages: updatedPages };
          }
        );

        // optimistic update do counter de replies ao parent_comment via query detail
        queryClient.setQueryData(
          COMMENT_KEYS.detail(parentCommentId),
          (old: IComment | undefined): IComment | undefined => {
            if (!old) return old;
            return {
              ...old,
              reply_count: old.reply_count + 1,
            };
          }
        );
      }

      // retorna o context com os snapshots para uso em onSuccess/onError
      return { previousRootComments, previousReplies, previousSingleComment, optimisticCommentId };
    },

    // mutação bem sucedida no servidor...
    onSuccess: (newCommentFromApi: IComment, _variables, context) => {
      const postId = newCommentFromApi.post_id;
      const parentCommentId = newCommentFromApi.parent_comment?.id;
      const optimisticId = context.optimisticCommentId;

      if (!postId) return;

      const updateCacheWithRealComment = (
        old: InfiniteData<AxiosResponse<IPaginatedResponse<IComment[]>>> | undefined
      ): InfiniteData<AxiosResponse<IPaginatedResponse<IComment[]>>> => {
        if (!old) {
          // case cache vazio, cria uma nova estrutura paginada com o novo comment real
          const mockHeaders = new AxiosHeaders();
          const mockConfig: InternalAxiosRequestConfig = { headers: mockHeaders };
          return {
            pages: [
              {
                data: { results: [newCommentFromApi], next: null, previous: null },
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

        const updatedPages = old.pages.map((page, pageIndex) => {
          if (pageIndex === 0) {
            const filteredResults = page.data.results.filter(
              (comment) => comment.id !== optimisticId && !isTempId(comment.id)
            )
            // let tempCommentReplaced = false; // indica se o temp comment foi substituído
            // const newResults: IComment[] = page.data.results.map(comment => {
            //   // combinação de atributos para identificar o comment otimista
            //   const isTempComment =
            //     comment.id.startsWith("temp-") &&
            //     comment.user?.id === newCommentFromApi.user?.id &&
            //     comment.content === newCommentFromApi.content &&
            //     comment.post_id === newCommentFromApi.post_id &&
            //     comment.parent_comment?.id === (newCommentFromApi.parent_comment?.id || null);

            //   if (isTempComment) {
            //     tempCommentReplaced = true;
            //     return newCommentFromApi;
            //   }
            //   return comment;
            // });

            // if (!tempCommentReplaced) {
            //   newResults.unshift(newCommentFromApi);
            // }

            return { ...page,
              data: { ...page.data, results: [newCommentFromApi, ...filteredResults] }
            };
          }
          return page;
        });
        return { ...old, pages: updatedPages };
      };

      if (!parentCommentId) {
        // reply direto a Post
        // force update
        queryClient.setQueryData(COMMENT_KEYS.rootList(postId), updateCacheWithRealComment);
        queryClient.invalidateQueries({ queryKey: ["posts", "detail", postId] });
      } else {
        // reply a um parent_comment
        // force update
        queryClient.setQueryData(
          COMMENT_KEYS.repliesList(parentCommentId),
          updateCacheWithRealComment
        );
        queryClient.invalidateQueries({ queryKey: COMMENT_KEYS.detail(parentCommentId) }); // Invalida o comentário pai para atualizar o count de replies
      }

      console.log("Comment created:", newCommentFromApi);
    },

    // mutação falhando no servidor...
    onError: (error, variables, context) => {
      // recebe o erro, as variáveis da mutação e o contexto (com os snapshots)
      console.error("Failed to create comment:", error);
      const postId = variables.get("post") as string;
      const parentCommentId = variables.get("parent_comment") as string;

      // rollback: restaura o cache para o estado anterior usando os snapshots
      if (context?.previousRootComments && postId) {
        queryClient.setQueryData(COMMENT_KEYS.rootList(postId), context.previousRootComments);
      }
      if (context?.previousReplies && parentCommentId) {
        queryClient.setQueryData(
          COMMENT_KEYS.repliesList(parentCommentId),
          context.previousReplies
        );
      }
      if (context?.previousSingleComment && parentCommentId) {
        queryClient.setQueryData(
          COMMENT_KEYS.detail(parentCommentId),
          context.previousSingleComment
        );
      }
    },
  });

  return { createComment: mutate, isLoading: isPending, isError, error, isSuccess };
};









/**
 * Hook para deletar um comentário.
 */
export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  // tipos para os dados retornados, erros, variáveis da mutação e context do onMutate
  type DeleteCommentError = AxiosError<ApiError>;
  type DeleteCommentContext = {
    previousRootComments: InfiniteData<AxiosResponse<IPaginatedResponse<IComment[]>>> | undefined;
    previousReplies: InfiniteData<AxiosResponse<IPaginatedResponse<IComment[]>>> | undefined;
    previousSingleCommentParent: IComment | undefined;
    parentPostId: string | undefined;
    parentOfDeletedCommentId: string | undefined;
  };

  const { mutate, isPending, isError, error, isSuccess } = useMutation<
    void, // tipo de retorno void -> requisição DELETE não retorna dados úteis
    DeleteCommentError,
    string, // commentId a ser deletado (variável da mutação)
    DeleteCommentContext
  >({
    mutationFn: deleteCommentRequest, // função de requisição DELETE real (definida em commentApi.ts)

    onMutate: async (commentIdToDelete: string): Promise<DeleteCommentContext> => {
      // tenta obter o post_id e parent_comment_id do cache
      const commentDetail = queryClient.getQueryData<IComment>(
        COMMENT_KEYS.detail(commentIdToDelete)
      );
      const parentPostId = commentDetail?.post_id;
      const parentOfDeletedCommentId = commentDetail?.parent_comment?.id;

      // cancelar queries relevantes
      if (parentPostId) {
        await queryClient.cancelQueries({ queryKey: COMMENT_KEYS.rootList(parentPostId) });
      }
      if (parentOfDeletedCommentId) {
        await queryClient.cancelQueries({
          queryKey: COMMENT_KEYS.repliesList(parentOfDeletedCommentId),
        });
        await queryClient.cancelQueries({
          queryKey: COMMENT_KEYS.detail(parentOfDeletedCommentId),
        });
      }
      await queryClient.cancelQueries({ queryKey: COMMENT_KEYS.detail(commentIdToDelete) });

      // snapshots do cache para rollback
      const previousRootComments = parentPostId
        ? queryClient.getQueryData<InfiniteData<AxiosResponse<IPaginatedResponse<IComment[]>>>>(
            COMMENT_KEYS.rootList(parentPostId)
          )
        : undefined;

      const previousReplies = parentOfDeletedCommentId
        ? queryClient.getQueryData<InfiniteData<AxiosResponse<IPaginatedResponse<IComment[]>>>>(
            COMMENT_KEYS.repliesList(parentOfDeletedCommentId)
          )
        : undefined;

      const previousSingleCommentParent = parentOfDeletedCommentId
        ? queryClient.getQueryData<IComment>(COMMENT_KEYS.detail(parentOfDeletedCommentId))
        : undefined;

      // optimistic update, removendo o comentário do cache
      if (parentPostId) {
        queryClient.setQueryData(
          COMMENT_KEYS.rootList(parentPostId),
          (
            old: InfiniteData<AxiosResponse<IPaginatedResponse<IComment[]>>> | undefined
          ): InfiniteData<AxiosResponse<IPaginatedResponse<IComment[]>>> => {
            if (!old) return { pages: [], pageParams: [] }; // caso não haja dados retorna vazio

            // filtra o comment a ser deletado de todas as páginas
            const updatedPages = old.pages.map(page => ({
              ...page,
              data: {
                ...page.data,
                results: page.data.results.filter(comment => comment.id !== commentIdToDelete),
              },
            }));
            return { ...old, pages: updatedPages };
          }
        );
      }

      // se o comment deletado era uma reply à um parent_comment, remove do repliesList
      if (parentOfDeletedCommentId) {
        queryClient.setQueryData(
          COMMENT_KEYS.repliesList(parentOfDeletedCommentId),
          (
            old: InfiniteData<AxiosResponse<IPaginatedResponse<IComment[]>>> | undefined
          ): InfiniteData<AxiosResponse<IPaginatedResponse<IComment[]>>> => {
            if (!old) return { pages: [], pageParams: [] };

            // filtra o comment a ser deletado de todas as páginas
            const updatedPages = old.pages.map(page => ({
              ...page,
              data: {
                ...page.data,
                results: page.data.results.filter(comment => comment.id !== commentIdToDelete),
              },
            }));
            return { ...old, pages: updatedPages };
          }
        );

        // optimistic update, decrementa o counter de replies ao parent_comment na query detail
        queryClient.setQueryData(
          COMMENT_KEYS.detail(parentOfDeletedCommentId),
          (old: IComment | undefined): IComment | undefined => {
            if (!old) return old;
            return {
              ...old,
              reply_count: Math.max(0, old.reply_count - 1), // reply_count não fica negativo
            };
          }
        );
      }

      // remove o comment do cache da query detail
      queryClient.setQueryData(COMMENT_KEYS.detail(commentIdToDelete), undefined);

      return {
        previousRootComments,
        previousReplies,
        previousSingleCommentParent,
        parentPostId,
        parentOfDeletedCommentId,
      };
    },

    // '_' = primeiro parâmetro (data) não é usado
    onSuccess: (_, deletedCommentId, context) => {
      console.log(`Comment ${deletedCommentId} deleted.`);

      // invalidando as queries
      // força refetch em segundo plano na próxima vez que os dados forem acessados
      if (context.parentPostId) {
        queryClient.invalidateQueries({ queryKey: COMMENT_KEYS.rootList(context.parentPostId) });
      }
      if (context.parentOfDeletedCommentId) {
        queryClient.invalidateQueries({
          queryKey: COMMENT_KEYS.repliesList(context.parentOfDeletedCommentId),
        });
        queryClient.invalidateQueries({
          queryKey: COMMENT_KEYS.detail(context.parentOfDeletedCommentId),
        });
      }
    },

    // '_variables' = segundo parâmetro (variáveis da mutação) não é usado
    onError: (error, _variables, context) => {
      console.error("Failed to delete comment:", error.response?.data || error.message);

      // rollback para o estado anterior usando os snapshots salvos no context
      if (context?.previousRootComments && context.parentPostId) {
        queryClient.setQueryData(
          COMMENT_KEYS.rootList(context.parentPostId),
          context.previousRootComments
        );
      }
      if (context?.previousReplies && context.parentOfDeletedCommentId) {
        queryClient.setQueryData(
          COMMENT_KEYS.repliesList(context.parentOfDeletedCommentId),
          context.previousReplies
        );
      }
      if (context?.previousSingleCommentParent && context.parentOfDeletedCommentId) {
        queryClient.setQueryData(
          COMMENT_KEYS.detail(context.parentOfDeletedCommentId),
          context.previousSingleCommentParent
        );
      }
    },
  });

  return {
    deleteComment: mutate,
    isLoading: isPending,
    isError,
    error,
    isSuccess,
  };
};
