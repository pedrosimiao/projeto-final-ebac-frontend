// src/pages/Feed/Explore/index.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigateBack } from "../../../hooks/useNavigateBack";


// Componentes da sua aplicação
import FeedHeader from "../../../components/FeedHeader";
import SearchBar from "../../../components/SearchBar";
import SearchList from "../../../components/SearchList";

// Hooks de busca
import { useSearchUsers } from "../../../hooks/useUsers";
import { useSearchHashtags } from "../../../hooks/useHashtags";

// Componentes de UI/Estilo
import { FaArrowLeft } from "react-icons/fa";

import LoadingSpinner from "../../../components/Loading";
import { ListLoaderContainer } from "../../../components/Loading/styles";
import { BackLink, FeedHeaderTextContent } from "../../../components/FeedHeader/styles";

import { ExploreContainer } from "./styles";

const Explore = () => {
  const back = useNavigateBack();

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(timerId);
    };
  }, [searchTerm]);

  const {
    data: users = [],
    isLoading: isUsersLoading,
    isError: isUsersError,
    error: usersError
  } = useSearchUsers(debouncedSearchTerm);

  const {
    data: hashtags = [],
    isLoading: isHashtagsLoading,
    isError: isHashtagsError,
    error: hashtagsError
  } = useSearchHashtags(debouncedSearchTerm);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  const isLoading = isUsersLoading || isHashtagsLoading;
  const hasError = isUsersError || isHashtagsError;
  const errorMessage = usersError?.message || hashtagsError?.message || "An unknown error occurred.";

  return (
    <>
      <FeedHeader>
        <BackLink to={back}>
          <FaArrowLeft />
        </BackLink>
        <FeedHeaderTextContent>
          <h1>Explore</h1>
        </FeedHeaderTextContent>
      </FeedHeader>
      <ExploreContainer>
        <SearchBar
          placeholder="Search users or #hashtags"
          value={searchTerm}
          onChange={handleSearchChange}
        />

        {isLoading && (
          <ListLoaderContainer>
            <LoadingSpinner size="2rem" />
          </ListLoaderContainer>
        )}

        {hasError && (
          <ListLoaderContainer style={{ color: "red" }}>
            <p>Error: {errorMessage}</p>
          </ListLoaderContainer>
        )}

        {!isLoading && !hasError && debouncedSearchTerm ? (
          <SearchList
            users={users}
            hashtags={hashtags}
          />
        ) : (
          !isLoading && !hasError && (
            <ListLoaderContainer>
              <p style={{ fontStyle: "italic", textAlign: "center" }}>Start typing to search users or hashtags.</p>
            </ListLoaderContainer>
          )
        )}
      </ExploreContainer>
    </>
  );
};

export default Explore;
