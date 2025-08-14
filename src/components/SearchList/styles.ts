// src/components/SearchList/styles.ts

import styled from "styled-components";
import { darken } from "polished"; // Para o hover dos hashtags, se quiser algo similar

export const SearchListContainer = styled.div`
  width: 100%;
  /* Removido o margin-top e border-top aqui, pois a ExplorePage já controla */
`;

export const TabContainer = styled.div`
  display: flex;
  justify-content: space-around;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.background};
`;

export const TabButton = styled.button<{ $isActive: boolean }>`
  flex: 1;
  padding: 1rem;
  background: none;
  border: none;
  border-bottom: 2px solid ${props => (props.$isActive ? props.theme.colors.accent : "transparent")};
  color: ${props => (props.$isActive ? props.theme.colors.accent : props.theme.colors.text)};
  font-weight: bold;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: ${({ theme }) => theme.colors.hoverBackground};
  }
`;

export const ResultsContainer = styled.div`
  min-height: 200px; /* Altura mínima para mostrar resultados ou mensagens */
`;

// Estilos específicos para a lista de hashtags
export const HashtagList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const HashtagItem = styled.li`
  padding: 1rem;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &:hover {
    background-color: ${darken(0.05, "#be2edd")}; /* Cor de hover similar ao UserList */
  }

  strong {
    color: ${({ theme }) => theme.colors.accent}; /* Destaque a hashtag com a cor de destaque */
    font-size: 1rem;
  }
`;
