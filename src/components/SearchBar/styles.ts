// src/components/SearchBar/styles.ts

import styled from "styled-components";

export const SearchContainer = styled.div`
  max-width: 100%;
  width: 100%;
  margin: 1rem auto;
  padding: 0 1rem;

  input {
    padding: 0.8rem 1rem;
    width: 100%;
    border: none;
    border-radius: 20px;
    background-color: ${({ theme }) => theme.colors.text};
    color: ${({ theme }) => theme.colors.background};
    font-size: 1rem;

    &:focus {
      outline: none;
      box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.accent};
    }
  }
`;
