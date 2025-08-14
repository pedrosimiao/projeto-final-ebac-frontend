// src/components/Comment/styles.ts

export {
  PostContainer,
  PostHeader,
  PostContent,
  MediaWrapper,
  PostFooter,
  FooterAction,
} from "../PostCard/styles";

import styled from "styled-components";
import { Link } from "react-router-dom"

export const CommentContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 7.25rem;
  border-top: 2px solid ${({ theme }) => theme.colors.border};
  position: relative;
  padding: 1rem 2.2rem;
`;

export const RepliedToLabel = styled.span`
  font-size: 0.8rem;
  font-weight: bold;
  color: #ecf0f1;
  margin-left: 2.7rem;
  display: inline-block;
`;

export const RepliedToLink = styled(Link)`
  color: inherit;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

export const CommentUserAvatar = styled.img`
  position: absolute;
  top: 0.7rem;
  left: 0.7rem;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
`;

export const CommentHeader = styled.div`
  display: flex;
  align-items: center;
`;

export const CommentUserInfo = styled.div`
  padding: 0 2.7rem;
  display: flex;
  align-items: center;
  flex-grow: 1;
  font-size: 0.9rem;
  gap: 0.3rem;
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
    display: grid;
    grid-template-columns: auto auto;
    grid-template-rows: auto auto;
    grid-template-areas:
      "name name"
      "info timestamp";
    gap: 0.2rem;
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

export const CommentTimestamp = styled.span`
  font-size: 0.75rem;
  white-space: nowrap;
  color: ${({ theme }) => theme.colors.accent};
`;

export const CommentContent = styled.div`
  margin: 0.3rem 0 0.5rem 2.7rem;

  line-height: 1.4;
  overflow-wrap: break-word;
  max-width: 100%;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    margin: 0 1.5rem 0 2.7rem;
  }

  @media (max-width: 320px) {
    margin: 0.5rem 0.5rem 0.5rem 0;
  }
`;
