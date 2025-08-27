// src/components/PostList.tsx

import { useRef, useEffect, useCallback, RefObject } from "react";
import { useLocation } from "react-router-dom";

import { IPost } from "../../types";

import Post from "../PostCard";
import LoadingSpinner from "../Loading";

import {
  useInfiniteFeedPosts,
  useInfiniteUserPosts,
  useInfiniteFollowingPosts,
} from "../../hooks/usePosts";

import { ListLoaderContainer } from "../Loading/styles";
import { PostListContainer } from "./styles";

export type PostListMode = "profile" | "following" | "forYou";

interface PostListProps {
  mode: PostListMode;
  profileUserId?: string; // modo "profile"
  pageScrollRef: RefObject<HTMLDivElement | null>; // ref para monitoamento do scroll do /src/pages/Feed/PageContainer
}

const PostList = ({ mode, profileUserId, pageScrollRef }: PostListProps) => {
  const location = useLocation();
  const isModal = location.pathname.startsWith("/compose");

  // ref para o elemento observer no final da PostList
  // *observer da rolagem do PageContainer
  const loader = useRef<HTMLDivElement>(null);

  // feed "For You" em Home
  const {
    posts: feedPosts, // => IPost[]
    fetchNextPage: fetchNextFeedPage,
    hasNextPage: hasNextFeedPage,
    isFetchingNextPage: isFetchingNextFeedPage,
    isLoading: isFeedLoading,
    isError: isFeedError,
    error: feedError,
  } = useInfiniteFeedPosts({ enabled: mode === "forYou" });

  // feed para page Profile
  const {
    posts: profilePosts, // => IPost[]
    fetchNextPage: fetchNextProfilePage,
    hasNextPage: hasNextProfilePage,
    isFetchingNextPage: isFetchingNextProfilePage,
    isLoading: isProfileLoading,
    isError: isProfileError,
    error: profileError,
  } = useInfiniteUserPosts(profileUserId, { enabled: mode === "profile" && !!profileUserId });

  // feed "Following" em Home
  const {
    posts: followingPosts, // => IPost[]
    fetchNextPage: fetchNextFollowingPage,
    hasNextPage: hasNextFollowingPage,
    isFetchingNextPage: isFetchingNextFollowingPage,
    isLoading: isFollowingLoading,
    isError: isFollowingError,
    error: followingError,
  } = useInfiniteFollowingPosts({ enabled: mode === "following" });


  // valores do hook ativo para a renderização atual
  let currentPosts: IPost[];
  let currentFetchNextPage: typeof fetchNextFeedPage; // Usando typeof para inferir o tipo da função
  let currentHasNextPage: typeof hasNextFeedPage;
  let currentIsFetchingNextPage: typeof isFetchingNextFeedPage;
  let currentIsLoading: typeof isFeedLoading;
  let currentIsError: typeof isFeedError;
  let currentError: typeof feedError;

  if (mode === "following") {
    currentPosts = followingPosts;
    currentFetchNextPage = fetchNextFollowingPage;
    currentHasNextPage = hasNextFollowingPage;
    currentIsFetchingNextPage = isFetchingNextFollowingPage;
    currentIsLoading = isFollowingLoading;
    currentIsError = isFollowingError;
    currentError = followingError;

  } else if (mode === "profile") {
    currentPosts = profilePosts;
    currentFetchNextPage = fetchNextProfilePage;
    currentHasNextPage = hasNextProfilePage;
    currentIsFetchingNextPage = isFetchingNextProfilePage;
    currentIsLoading = isProfileLoading;
    currentIsError = isProfileError;
    currentError = profileError;

  } else { // mode === "forYou"
    currentPosts = feedPosts;
    currentFetchNextPage = fetchNextFeedPage;
    currentHasNextPage = hasNextFeedPage;
    currentIsFetchingNextPage = isFetchingNextFeedPage;
    currentIsLoading = isFeedLoading;
    currentIsError = isFeedError;
    currentError = feedError;
  }

  // lógica do Infinite Scroll com useCallback e useEffect

  // função callback que será executada quando o loader entrar na área visível.
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];

      // se o loader está visível (isItersecting) & se há mais páginas pra carregar & se não houver
      // busca pela próxima página sendo executada
      if (target.isIntersecting && currentHasNextPage && !currentIsFetchingNextPage) {
        currentFetchNextPage(); // Chama a função para buscar a próxima página de posts
      }
    },

    // listagem de dependências do useCallback
    [currentFetchNextPage, currentHasNextPage, currentIsFetchingNextPage]
  );

  // configurar e limpar o IntersectionObserver
  useEffect(() => {
    const currentLoaderElement = loader.current; // observer
    const currentScrollRoot = pageScrollRef.current; // root de rolagem (PageContainer)

    // cria e observa se ambos (observer e o root de rolagem) != null
    // inicialmente pageScrollRef.current === null
    if (currentLoaderElement && currentScrollRoot) {
      const option: IntersectionObserverInit = {
        root: currentScrollRoot, // PageContainer
        rootMargin: "20px",
        threshold: 0.1, // disparo com 10% do observer visível
      };

      const observer = new IntersectionObserver(handleObserver, option);
      observer.observe(currentLoaderElement);

      // cleanup function p/ evitar desligar o observer na desmontagem ou
      // na mudança na lista dedependências.
      return () => {
        observer.unobserve(currentLoaderElement);
      };
    }
    // lista de dependências
    // observer é recriado se a lista de dependências de handleObserver mudar
    // ou se pageScrollRef (referência ao elemento DOM) mudar
    // a ref do PageContainer é estática, só muda no primeiro render
  }, [handleObserver, pageScrollRef]);


  if (isModal) return null;


  if (currentIsLoading) {
    return <ListLoaderContainer><LoadingSpinner size="1.5rem" /></ListLoaderContainer>;
  }


  if (currentIsError) {
    return (
      <ListLoaderContainer style={{ color: "red" }}>
        Error: {currentError?.message || "An unknown error occurred"}
      </ListLoaderContainer>
    );
  }

  // msgs feeds vazios
  if (mode === "following" && (!currentPosts || currentPosts.length === 0) && !currentIsLoading && !currentIsError) {
    return (
      <ListLoaderContainer>
        <div style={{ fontStyle: "italic", display: "flex", justifyContent: "center", fontSize: "20px" }}>
          You're not following anyone yet, or they haven't posted anything.
          <br />
          <span style={{ fontWeight: "bold" }}>Check out the "For You" feed for more content!</span>
        </div>
      </ListLoaderContainer>
    );
  }

  if (currentPosts.length === 0 && !currentIsLoading && !currentIsError) {
    return <ListLoaderContainer><div style={{ fontStyle: "italic", display: "flex", justifyContent: "center", fontSize: "20px" }}>No more posts to display.</div></ListLoaderContainer>;
  }

  return (
    <PostListContainer>
      {currentPosts.map((post: IPost) => (
        <Post key={post.id} post={post} />
      ))}

      {currentHasNextPage && (
        <ListLoaderContainer ref={loader}>
          {currentIsFetchingNextPage ? (
            <LoadingSpinner size="1.5rem" />
          ) : (
            <div style={{ height: "1px" }}></div>
          )}
        </ListLoaderContainer>
      )}

      {!currentHasNextPage && !currentIsLoading && currentPosts.length > 0 && (
        <ListLoaderContainer>
          <div style={{ fontStyle: "italic", fontSize: "20px" }}>
            You've reached the end of the posts.
          </div>
        </ListLoaderContainer>
      )}
    </PostListContainer>
  );
};

export default PostList;
