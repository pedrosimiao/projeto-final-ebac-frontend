// src/pages/Feed/SettingsPage/styles.ts

import styled from "styled-components";
import { darken } from "polished";

export const SettingsContainer = styled.div`
  width: 100%;
  max-width: 600px;
  height: calc(100vh - 60px);
  /* padding-top: 3.25rem; */
  display: flex;
  flex-direction: column;
`;

export const SettingsOption = styled.div`
  width: 100%;
  padding: 1rem;
  cursor: pointer;
  font-weight: 600;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  transition: background-color 0.2s ease;
  position: relative;

  svg {
    position: absolute;
    top: 1rem;
    right: 1.5rem;
    font-size: 24px;
  }

  &:hover {
    background: ${darken(0.1, "#be2edd")};
  }
`;
