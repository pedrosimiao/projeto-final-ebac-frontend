// src/components/CommentDetailCard/styles.ts

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

export {
  RepliedToLink,
} from "../CommentCard/styles"

import styled from "styled-components";

export const RepliedToLabel = styled.span`
  font-size: 0.85rem;
  font-weight: bold;
  color: #ecf0f1;
  display: inline-block;
`;


export const FullCommentUserAvatar = styled.img`
  position: absolute;
  top: 0.7rem;
  left: 0.7rem;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
`;

export const FullCommentUserInfo = styled.div`
  padding: 0.2rem 4rem 0.7rem 3rem;
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

export const FullCommentContent = styled.div`
  margin-top: 0.5rem;
  font-size: 1rem;
  line-height: 1.4;
  overflow-wrap: break-word;
  max-width: 100%;
`;

export const FullCommentTimestamp = styled.span`
  font-size: 1rem;
  line-height: 1rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
  white-space: nowrap;
  color: ${({ theme }) => theme.colors.accent};
`;
