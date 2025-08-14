// src/components/UserList/styles.ts

import styled from "styled-components";
import { darken } from "polished";

export const List = styled.ul`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0;
  margin: 0;
`;

export const Item = styled.li`
  display: flex;
  align-items: center;
  padding: 1rem;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border}; /* Linha mais fina */

  &:hover {
    background-color: ${darken(0.05, "#be2edd")};
  }
`;

export const Avatar = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  margin-right: 1rem;
  object-fit: cover;
`;

export const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

export const UserName = styled.span`
  font-weight: bold;
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text};
  margin-right: 4px;
`;

export const UserHandle = styled.small`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.textAlt};
`;
