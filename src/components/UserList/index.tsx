// src/components/UserList/index.tsx

import { useEffect, useRef, useCallback, RefObject } from "react";
import { useNavigate } from "react-router-dom";

import { useFollowersList, useFollowingList } from "../../hooks/useFollows";
import { useUserByUsername } from "../../hooks/useUsers";
import { extractErrorMessage } from "../../utils/apiErrorUtils"; // Importar para tratamento de erro

import LoadingSpinner from "../Loading";

import { ListLoaderContainer } from "../Loading/styles";

import {
  List,
  Item,
  Avatar,
  UserInfo,
  UserName,
  UserHandle,
} from "./styles";

import { IUser } from "../../types";

interface UserListProps {
  username: string;
  type: "followers" | "following";
  pageScrollRef: RefObject<HTMLDivElement | null>; // ref para monitoamento do scroll do /src/pages/Feed/PageContainer
}

export default function UserList({ username, type, pageScrollRef }: UserListProps) {
  const navigate = useNavigate();

  // ID do user via username na URL
  const {
    data: profileUser,
    isLoading: isProfileUserLoading,
    isError: isProfileUserError,
    error: profileUserError, // renomeado para evitar conflito e para ser o objeto de erro
  } = useUserByUsername(username);
  const profileUserId = profileUser?.id;


  // prop enabled dos hooks: requisição disparada if(profileUserId)
  const followersQuery = useFollowersList(profileUserId);
  const followingQuery = useFollowingList(profileUserId);

  // funções relevantes condicionadas pela prop type: UserListProps
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = type === "followers" ? followersQuery : followingQuery;

  // ref para o elemento observer no final da PostList
  // *observer da rolagem do PageContainer
  const loader = useRef<HTMLDivElement>(null);

  const users: IUser[] = data?.pages.flatMap(page => page.results) || [];

  // lógica do Infinite Scroll com useCallback e useEffect

  // função callback que será executada quando o loader entrar na área visível.
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;

      // se profileUserId != null & o loader está visível & se há mais páginas pra carregar & se não houver
      // busca pela próxima página sendo executada
      if (profileUserId && target.isIntersecting && hasNextPage && !isFetchingNextPage) {
        console.log(`IntersectionObserver: Fetching next page of ${type} users for user ID: ${profileUserId}...`);
        fetchNextPage();
      }
    },

    // listagem de dependências do useCallback
    [fetchNextPage, hasNextPage, isFetchingNextPage, type, profileUserId]
  );

  // configurar e limpar o IntersectionObserver
  useEffect(() => {
    const currentLoaderElement = loader.current;
    const currentScrollRoot = pageScrollRef.current;

    // cria e observa se profileUserId & observer e & root de rolagem != null
    // inicialmente pageScrollRef.current === null
    if (profileUserId && currentLoaderElement && currentScrollRoot) {
      const options: IntersectionObserverInit = {
        root: currentScrollRoot,
        rootMargin: "0px",
        threshold: 0.1,
      };

      const observer = new IntersectionObserver(handleObserver, options);
      observer.observe(currentLoaderElement);

      // cleanup function p/  desligar o observer na desmontagem ou
      // na mudança na lista dedependências.
      return () => {
        observer.unobserve(currentLoaderElement);
      };
    }
    // lista de dependências
    // observer é recriado se a lista de dependências de handleObserver mudar
    // ,se pageScrollRef (referência ao elemento DOM) mudar
    // ou se profileUserId mudar
    // a ref do PageContainer é estática, só muda no primeiro render
  }, [handleObserver, pageScrollRef, profileUserId]);


  if (isProfileUserLoading) {
    return (
      <ListLoaderContainer>
        <LoadingSpinner $spinnerColor="accent" size="2rem" />
      </ListLoaderContainer>
    );
  }

  if (isProfileUserError) {
    return <p>Error loading user profile: {extractErrorMessage(profileUserError)}</p>;
  }

  if (!profileUser) {
    return <p>User data not available for {username}.</p>;
  }

  if (isLoading && users.length === 0) {
    return (
      <ListLoaderContainer>
        <LoadingSpinner $spinnerColor="accent" size="2rem" />
      </ListLoaderContainer>
    );
  }

  if (isError) {
    return <p>Error loading {type} list: {extractErrorMessage(error)}</p>;
  }

  if (!users || users.length === 0) {
    return <h4>No {type} found.</h4>;
  }

  return (
    <List>
      {users.map((user: IUser) => (
        <Item key={user.id} onClick={() => navigate(`/${user.username}`)}>
          <Avatar src={user.profile_picture || "/default-avatar.png"} alt={user.username} />
          <UserInfo>
            <UserName>{user.firstName} {user.lastName}</UserName>
            <UserHandle>@{user.username}</UserHandle>
          </UserInfo>
        </Item>
      ))}

      {hasNextPage && (
        <ListLoaderContainer ref={loader}>
          {isFetchingNextPage ? (
            <LoadingSpinner $spinnerColor="accent" size="2rem" />
          ) : (
            <div style={{ height: "1px" }}></div>
          )}
        </ListLoaderContainer>
      )}

      {!hasNextPage && !isLoading && users.length > 0 && (
        <ListLoaderContainer>
          <div style={{ fontStyle: "italic" }}>
            You've reached the end of the {type} list.
          </div>
        </ListLoaderContainer>
      )}
    </List>
  );
}
