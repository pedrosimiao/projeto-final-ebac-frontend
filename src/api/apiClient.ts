// src/api/apiClient.ts

// pipeline de todas as requisições
// interceptações de requests e responses


// axios: lib requisições http
// AxiosError: tipagem da estrutura de erros gerados pelo axios
// AxiosRequestConfig: tipagem para requisição (headers, params...)
import axios, { AxiosError, AxiosRequestConfig } from "axios";

// store: estado global
// RootState: tipagem do estado global
import store, { RootState } from "../store/store";

// setTokens, logout: actions do authSlice - atualizar/remover tokens
import { setTokens, logout } from "../store/slices/authSlice";

// refreshTokenApi: request fn p/ renovar o token de acesso (chamada backend)
import { refreshTokenApi } from "./authApi";

// criação de instância axios
// withCredentials: true -> envio automático de cookies, auth headers e credentials nos requests
// p/ cookies para controle de sessão, CSRF
const apiClient = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: true,
});


// interceptor de request
apiClient.interceptors.request.use(config => {
  // estado global atual
  const state: RootState = store.getState();

  // buscando token de acesso via authSlice do redux OU persistência do navegador (localStorage)
  const token = state.auth.accessToken || localStorage.getItem("accessToken");

  // check se token existe: insere header http (Authorization: Bearer <token>)
  // padrão de autenticação JWT compativel com que o backend espera
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});




// isRefreshing: indicador de request de refresh de token em andamento
let isRefreshing = false;

// failedQueue: fila de promessas de failed requests (401 Unauthorized) durante um refresh
// p/ evitar que múltiplos refreshes sejam disparados ao mesmo tempo
let failedQueue: { resolve: (token: string) => void; reject: (err: unknown) => void }[] = [];

// aux fn p/ processar requests da fila failedQueue
const processQueue = (error: unknown, token: string | null = null) => {
  // para cada request em failedQueue
  failedQueue.forEach(prom => {
    // em caso de erro: .reject()
    if (error) {
      prom.reject(error);

    // em caso de refresh: resolve(token)
    } else if (token) {
      prom.resolve(token);
    }
  });
  // limpa a fila
  failedQueue = [];
};



// interceptor de response
apiClient.interceptors.response.use(
  // retorna resposta vinda, sem alteração
  response => response,

  // tratamento de erros de resposta
  async (error: AxiosError) => {
    // copia do request original que gerou erro
    // _retry: marcador de request já tentada
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    // se status = 401 Unauthorized e request não foi retried -> tentar renovar o token.
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // marca request como tentada

      const state: RootState = store.getState();
      // refresh token de acesso via authSlice do redux OU persistência do navegador (localStorage)
      const refreshToken = state.auth.refreshToken || localStorage.getItem("refreshToken");

      // if !refreshToken: deslogar user, retornar error
      if (!refreshToken) {
        store.dispatch(logout());
        return Promise.reject(error);
      }

      // if refresh em andamento: push request à fila failedQueue
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            // check request original: insere header http (Authorization: Bearer <token>)
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch(Promise.reject);
      }

      // começar um refresh
      isRefreshing = true;

      try {
        // pega um novo access token
        const { access } = await refreshTokenApi(refreshToken);
        // atualiza o redux
        store.dispatch(setTokens({ accessToken: access }));
        // libera requests pendentes
        processQueue(null, access);

        // check request original: insere header http (Authorization: Bearer <token>)
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${access}`;
        }
        return apiClient(originalRequest);
      } catch (refreshError) {
        // caso refresh falhe: processa a fila
        processQueue(refreshError, null);
        // desloga
        store.dispatch(logout());
        // reject requests pendentes
        return Promise.reject(refreshError);
      } finally {
        // libera p/ novos refreshes
        isRefreshing = false;
      }
    }

    // if !401 ou _retry, retorna só o erro original.
    return Promise.reject(error);
  }
);

export default apiClient;
