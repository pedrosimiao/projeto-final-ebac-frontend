//src/components/Post/styles.ts

import styled from "styled-components";
import { darken } from "polished";

interface RetweetProps {
  $isRetweet?: boolean;
  $hasRepliedTo?: boolean;
  $forceHover?: boolean;
}

export const PostContainer = styled.div<RetweetProps>`
  position: relative;
  padding: ${({ $hasRepliedTo }) => ($hasRepliedTo ? "2.2rem 1rem 1rem" : "1rem")};
  width: 100%;
  display: flex;
  flex-direction: column;
  border-bottom: ${({ $isRetweet, theme }) =>
    $isRetweet ? "none" : `1px solid ${theme.colors.border}`};
  z-index: 0;

  ${({ $forceHover = true }) =>
    $forceHover &&
    `
      &:hover {
        cursor: pointer;
        background-color: ${darken(0.1, "#be2edd")};
      }
    `}
`;

export const RetweetContainer = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  padding: 0.75rem;
  margin-top: 1rem;
  margin-bottom: 0.5rem;

  &:hover {
    cursor: pointer;
    background-color: ${darken(0.1, "#be2edd")};
  }
`;

export const UserAvatar = styled.img<RetweetProps>`
  position: absolute;
  top: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
`;

export const RetweetLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${({ theme }) => theme.colors.accent};
  font-size: 0.85rem;
  margin-bottom: 0.5rem;

  svg {
    width: 32px;
    height: 32px;
  }
`;

export const PostHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0;
`;

export const PostUserInfo = styled.div<{ $hasContent: boolean }>`
  padding: ${({ $hasContent }) =>
    $hasContent ? "0 3rem 0.2rem 3rem;" : "0.7rem 3rem 0.2rem 3rem"};
  min-width: 0;
  max-width: 100%;
  display: flex;
  align-items: center;
  flex-grow: 1;
  font-size: 1rem;
  gap: 0.5rem;
  color: ${({ theme }) => theme.colors.text};

  a,
  h4,
  p {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
  }

  h4 {
    line-height: 1;
  }

  p {
    font-size: 0.8rem;
  }

  a {
    display: flex;
    align-items: center;
    color: inherit;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-grow: 1;
    font-size: 0.9rem;
    gap: 0.4rem;
    white-space: nowrap;
  }

  @media (max-width: 320px) {
    padding: ${({ $hasContent }) =>
      $hasContent ? "0 3rem 0.2rem 3rem;" : "0.3rem 3rem 0.2rem 3rem"};
    display: grid;
    grid-template-columns: auto auto;
    grid-template-rows: auto auto;
    grid-template-areas:
      "name name"
      "info timestamp";
    gap: 0.25rem;
    justify-content: start;

    & > a:first-of-type {
      grid-area: name;
    }

    & > a:nth-of-type(2) {
      grid-area: info;
    }

    & > span {
      grid-area: timestamp;
      align-self: center;
    }
  }
`;

export const PostTimestamp = styled.span`
  font-size: 0.75rem;
  line-height: 1rem;
  margin-left: none;
  white-space: nowrap;
`;

export const PostContent = styled.div`
  margin: 0 3rem 0rem 3rem;
  font-size: 0.9rem;
  line-height: 1.4;
  overflow-wrap: break-word;
  max-width: 100%;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    margin: 0 1.5rem 0 3rem;
  }

  @media (max-width: 320px) {
    margin: 0 0.5rem 0.5rem 0.5rem;
  }
`;

export const MediaWrapper = styled.div<RetweetProps>`
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  display: flex;
  justify-content: center;

  img,
  video {
    width: auto;
    max-width: 500px;
    max-height: 400px;
    object-fit: fill;
    border-radius: 8px;

    @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
      max-width: 400px;
    }

    @media (max-width: ${({ theme }) => theme.breakpoints.smallest}) {
      max-width: 300px;
    }

    ${({ $isRetweet, theme }) =>
      $isRetweet &&
      `
      @media (max-width: ${theme.breakpoints.mobile}) {
        max-width: 360px;
      }

      @media (max-width: ${theme.breakpoints.smallest}) {
        max-width: 260px;
      }
    `}
  }
`;

export const PostFooter = styled.div`
  padding: 0 3rem;
  display: flex;
  justify-content: space-between;
  margin-top: 0.5rem;
  color: ${({ theme }) => theme.colors.accent};
  font-size: 0.9rem;

  div {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    cursor: pointer;
    transition: opacity 0.2s ease;

    &:hover {
      opacity: 0.8;
    }
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 0 1rem;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.smallest}) {
    padding: 0 0.5rem;
  }
`;

export const FooterAction = styled.div`
  display: flex;
  align-items: center;

  svg {
    width: 24px;
    height: 24px;
    margin-right: 0.2rem;

    @media (max-width: 320px) {
      width: 20px;
      height: 20px;
    }
  }
`;

export const ReplyViewer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 0.5rem;
  color: ${({ theme }) => theme.colors.accent};
  font-size: 0.9rem;

  span {
    text-decoration: underline;
  }
`;
