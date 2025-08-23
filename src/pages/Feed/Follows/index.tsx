// src/pages/Feed/Follows/index.tsx

import { RefObject, useState } from "react";
import { useParams, useOutletContext } from "react-router-dom";

import { useUserByUsername } from "../../../hooks/useUsers"; // Para obter o ID do usuário pelo username

import FeedHeader from "../../../components/FeedHeader";
import UserList from "../../../components/UserList"; // O componente de lista de usuários que criamos
import LoadingSpinner from "../../../components/Loading";
import { ListLoaderContainer } from "../../../components/Loading/styles"; // Estilos para o spinner

import { FaArrowLeft } from "react-icons/fa";

import { BackLink, FeedHeaderTextContent, FeedSelector } from "../../../components/FeedHeader/styles"; // Importa FeedSelector
import { FollowsContainer } from "./styles"; // O container que acabamos de estilizar
import { extractErrorMessage } from "../../../utils/apiErrorUtils"; // Para tratamento de erro

type FollowListMode = "followers" | "following";

interface OutletContextType {
  pageScrollRef: RefObject<HTMLDivElement | null>;
}

export default function FollowsPage() {
  const { username } = useParams<{ username: string }>();
  const { pageScrollRef } = useOutletContext<OutletContextType>();

  const [mode, setMode] = useState<FollowListMode>("followers");

  const {
    data: profileUser,
    isLoading: isProfileUserLoading,
    isError: isProfileUserError,
    error: profileUserError,
  } = useUserByUsername(username);

  if (isProfileUserLoading) {
    return (
      <>
        <FeedHeader>
          <BackLink to={`/${username || "home"}`}>
            <FaArrowLeft />
          </BackLink>
          <FeedHeaderTextContent>
            <h1>Loading...</h1>
          </FeedHeaderTextContent>
        </FeedHeader>
        <FollowsContainer>
          <ListLoaderContainer>
            <LoadingSpinner $spinnerColor="accent" size="2rem" />
          </ListLoaderContainer>
        </FollowsContainer>
      </>
    );
  }

  if (isProfileUserError) {
    return (
      <>
        <FeedHeader>
          <BackLink to={`/${username || "home"}`}>
            <FaArrowLeft />
          </BackLink>
          <FeedHeaderTextContent>
            <h1>Error</h1>
          </FeedHeaderTextContent>
        </FeedHeader>
        <FollowsContainer>
          <p>Error loading user profile: {extractErrorMessage(profileUserError)}</p>
        </FollowsContainer>
      </>
    );
  }

  if (!profileUser) {
    return (
      <>
        <FeedHeader>
          <BackLink to={`/${username || "home"}`}>
            <FaArrowLeft />
          </BackLink>
          <FeedHeaderTextContent>
            <h1>User Not Found</h1>
          </FeedHeaderTextContent>
        </FeedHeader>
        <FollowsContainer>
          <p>The user "{username}" could not be found.</p>
        </FollowsContainer>
      </>
    );
  }

  if (!pageScrollRef || !pageScrollRef.current) {
    return (
      <>
        <FeedHeader>
          <BackLink to={`/${profileUser.username}`}>
            <FaArrowLeft />
          </BackLink>
          <FeedHeaderTextContent>
            <h1>{profileUser.firstName} {profileUser.lastName}</h1>
          </FeedHeaderTextContent>
        </FeedHeader>
        <FollowsContainer>
          <p>Initializing page content...</p>
        </FollowsContainer>
      </>
    );
  }

  return (
    <>
      <FeedHeader noPadding={true}>
        <BackLink to={`/${profileUser.username}`}>
          <FaArrowLeft />
        </BackLink>
        <FeedSelector selected={mode === "followers"} onClick={() => setMode("followers")}>
          <span>Followers</span>
        </FeedSelector>
        <FeedSelector selected={mode === "following"} onClick={() => setMode("following")}>
          <span>Following</span>
        </FeedSelector>
      </FeedHeader>
      <FollowsContainer>
        <UserList
          username={profileUser.username}
          type={mode} // "followers" | "following"
          pageScrollRef={pageScrollRef} // PageContainer
        />
      </FollowsContainer>
    </>
  );
}
