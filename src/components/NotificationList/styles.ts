// src/components/NotificationList/styles.ts

import styled from "styled-components";
import { darken } from "polished";

export const List = styled.ul`
  display: flex;
  flex-direction: column;
`;

export const Item = styled.li`
  display: flex;
  align-items: center;
  padding: 1rem;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text};
  border-bottom: 2px solid ${({ theme }) => theme.colors.border};

  &:hover {
    background-color: ${darken(0.1, "#be2edd")};
  }
`;

export const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 12px;
  object-fit: cover;
  cursor: pointer;
`;

export const SenderName = styled.span`
  font-weight: bold;
  margin-right: 4px;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

export const NotificationText = styled.div`
  flex: 1;
  font-size: 14px;
`;

export const TimeStamp = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textAlt};
  margin-top: 2px;
`;

