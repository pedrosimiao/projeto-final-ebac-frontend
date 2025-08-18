// src/components/FeedHeader/styles.ts

import styled from "styled-components";
import { Link } from "react-router-dom";

interface FeedHeaderProps {
  // transient prop
  $noPadding?: boolean;
}

export const FeedHeaderContainer = styled.header<FeedHeaderProps>`
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  max-width: 600px;
  width: 100%;
  //height: 3.25rem;
  padding: ${({ $noPadding }) => ($noPadding ? "0" : "1rem")};
  background-image: ${({ theme }) => theme.colors.backgroundGradient};
  background-clip: padding-box;
  color: ${({ theme }) => theme.colors.text};
  text-shadow: none;
  z-index: 9998;
`;

export const BackLink = styled(Link)`
  margin-right: 1rem;
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.text};
  text-decoration: none;

  &:hover {
    color: ${({ theme }) => theme.colors.accent};
  }
`;

export const FeedHeaderTextContent = styled.div`
  display: block;

  h1 {
    font-size: 1rem;
  }

  p {
    font-size: 0.8rem;
  }
`;

export const FeedSelector = styled.div<{ selected: boolean }>`
  display: flex;
  justify-content: center;
  width: 50%;
  height: 100%;
  font-size: 0.9rem;
  font-weight: 600;
  color: ${({ theme, selected }) => (selected ? theme.colors.background : theme.colors.background)};
  border-bottom: none;
  background-color: ${({ theme }) => theme.colors.text};

  span {
    height: 100%;
    display: flex;
    align-items: center;
    transition: border-bottom 0.2s ease;
    border-bottom: ${({ selected, theme }) =>
      selected ? `3px solid ${theme.colors.background}` : "none"};

    &:hover {
      border-bottom: 3px solid ${({ theme }) => theme.colors.background};
    }
  }

  &:hover {
    cursor: pointer;
    background-color: ${({ theme }) => theme.colors.accent};

    span {
      border-bottom: ${({ selected, theme }) =>
        selected
          ? `3px solid ${theme.colors.background}`
          : `3px solid ${theme.colors.backgroundGradient}`};
    }
  }
`;
