// src/components/PostDetailCard/styles.ts

export {
  PostContainer,
  PostHeader,
  PostContent,
  MediaWrapper,
  PostFooter,
  FooterAction,
  RetweetContainer,
  RetweetLabel,
} from "../PostCard/styles";

import styled from "styled-components";

export const FullPostUserAvatar = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
`;

export const FullPostUserInfo = styled.div`
  padding: 0.5rem 4rem 0.7rem 3.5rem;
  display: block;
  font-size: 1rem;
  gap: 0.5rem;
  color: ${({ theme }) => theme.colors.text};

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
`;

export const FullPostContent = styled.div`
  margin: 0 3rem 0.5rem 3.5rem;
  font-size: 1rem;
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

export const FullPostTimestamp = styled.span`
  font-size: 1rem;
  line-height: 1rem;
  margin-left: none;
  margin-top: 1rem;
  margin-bottom: 1rem;
  white-space: nowrap;
  color: ${({ theme }) => theme.colors.accent};
`;
