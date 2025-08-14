import styled from "styled-components";
import { Link } from "react-router-dom";

export const StyledLink = styled.a`
  color: ${({ theme }) => theme.colors.link};
  text-decoration: underline;
  word-break: break-all;

  &:hover {
    text-decoration: none;
  }
`;

export const StyledMention = styled(Link)`
  color: ${({ theme }) => theme.colors.text};
  font-weight: 600;

  &:hover {
    text-decoration: underline;
  }
`;

export const StyledHashtag = styled(Link)`
  color: ${({ theme }) => theme.colors.accent};
  font-weight: 600;

  &:hover {
    text-decoration: underline;
  }
`;
