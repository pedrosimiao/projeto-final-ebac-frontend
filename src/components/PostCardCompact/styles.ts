// src/components/PostCardCompact/styles.ts

import styled from "styled-components";

interface NestedProps {
  $isNested?: boolean;
}

export const CompactCard = styled.div`
  border-radius: 0.75rem;
  padding: 0.75rem;
  margin-top: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  color: black;
  overflow: hidden;
  position: relative;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    max-height: 300px;
  }
`;

export const NestedRetweetContainer = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.background};
  border-radius: 8px;
  padding: 0.75rem;
  margin-top: 0.75rem;
  cursor: pointer;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    overflow-y: auto;
  }
`;

export const RetweetLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${({ theme }) => theme.colors.background};
  font-size: 0.85rem;
  margin-bottom: 0.5rem;

  svg {
    width: 16px;
    height: 16px;
  }
`;

export const CompactHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const CompactAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
`;

export const CompactUserInfo = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 0.85rem;

  h4 {
    margin: 0;
    font-size: 0.95rem;
  }

  small {
    color: gray;
    font-size: 0.75rem;
  }
`;

export const CompactContent = styled.div<NestedProps>`
  font-size: 0.9rem;
  white-space: pre-wrap;

  ${({ $isNested }) =>
    $isNested &&
    `
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    white-space: normal;
  `}
`;

export const CompactMedia = styled.div`
  overflow: hidden;
  display: flex;
  justify-content: center;
  width: 100%;

  img,
  video {
    width: 100%;
    max-height: 30vh;
    object-fit: contain;
    display: block;
    border-radius: 8px;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    max-height: 200px;
  }
}
`;
