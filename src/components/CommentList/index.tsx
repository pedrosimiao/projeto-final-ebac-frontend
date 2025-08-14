// src/components/CommentList/index.tsx

import { useRef, useEffect, useCallback, RefObject } from "react";

import { IComment } from "../../types";

import CommentCard from "../CommentCard";
import LoadingSpinner from "../Loading"

import { ListLoaderContainer } from "../Loading/styles"

import { CommentListWrapper } from "./styles";

interface CommentListProps {
  comments: IComment[];
  contextCommentId?: string | null;
  pageScrollRef: RefObject<HTMLDivElement | null>;

  // abordagem "presentational"
  // não usa hooks de fetching diretamente
  // recebe props de paginação do componente recipiente (StatusPage)
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

const CommentList = ({
  comments,
  contextCommentId,
  pageScrollRef, // ref do PageContainer (root do observer)
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  isLoading,
  isError,
  error,
}: CommentListProps) => {
  // ref para o elemento observer no final da PostList
  // *observer da rolagem do PageContainer
  const loader = useRef<HTMLDivElement>(null);

  // função callback que será executada quando o loader entrar na área visível.
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];

      // se o loader está visível (isItersecting) & se há mais páginas pra carregar & se não houver
      // busca pela próxima página sendo executada
      if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage(); // Chama a função para buscar a próxima página de comentários/replies
      }
    },

    // listagem de dependências do useCallback
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  );

  // configurar o IntersectionObserver
  useEffect(() => {
    if (!pageScrollRef) {
      console.warn("CommentList useEffect: pageScrollRef prop is undefined. Cannot initialize Intersection Observer.");
      return;
    }

    const currentLoaderElement = loader.current;
    const currentScrollRoot = pageScrollRef.current; // root de rolagem (PageContainer)

    // estado de loader.current no momento da execução do useEffect
    console.log("CommentList useEffect - loader.current (at check):", currentLoaderElement);

    // check if ambos os elementos existem antes da criação do observer
    if (!currentLoaderElement || !currentScrollRoot) {
      console.warn("Intersection Observer not initialized: Missing loader or scroll root.");
      return;
    }

    const option: IntersectionObserverInit = {
      root: currentScrollRoot,
      rootMargin: "20px",
      threshold: 0.1,
    };

    const observer = new IntersectionObserver(handleObserver, option);
    observer.observe(currentLoaderElement);

    return () => {
      observer.unobserve(currentLoaderElement);
      observer.disconnect();
    };
  }, [handleObserver, pageScrollRef]);

  // componente **sempre retorna a estrutura principal**,
  // e o conteúdo dentro dela é que é condicional.

  let commentsContent;

  if (isLoading) {
    commentsContent = <LoadingSpinner size="1.5rem" />;

  } else if (isError) {
    commentsContent = (
      <div style={{ color: "red" }}>
        Error loading comments: {error?.message}
      </div>
    );

  } else {
    // Se não estiver em um dos estados de loading/error/empty,
    // renderiza os comentários
    commentsContent = (
      <CommentListWrapper>
        {comments.map((comment) => (
          <CommentCard
            key={comment.id}
            comment={comment}
            contextCommentId={contextCommentId}
          />
        ))}
      </CommentListWrapper>
    );
  }


  return (
    <div>
      {/* render conteúdo principal (comentários ou mensagens de estado) */}
      {commentsContent}

      {/*
        loader element do IntersectionObserver
        sempre no DOM para que loader.current seja atribuido
        visibilidade controlada pelo hasNextPage ou isFetchingNextPage
      */}
      <ListLoaderContainer ref={loader} style={{ visibility: hasNextPage || isFetchingNextPage ? 'visible' : 'hidden' }}>
        {isFetchingNextPage ? (
          <LoadingSpinner size="1.5rem" />
        ) : (
          <div>Scroll to load more</div>
        )}
      </ListLoaderContainer>
    </div>
  );
};

export default CommentList;
