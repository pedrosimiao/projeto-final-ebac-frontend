// src/components/DeleteButton/styles.ts

import styled from "styled-components";


export const DeleteButtonWrapper = styled.div`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  z-index: 1;
`;

export const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;
  cursor: pointer;

  svg {
    color: ${({ theme }) => theme.colors.text};
  }

  &:hover {
    transform: scale(1.1);
    transition: transform 0.2s ease
  }
`;
