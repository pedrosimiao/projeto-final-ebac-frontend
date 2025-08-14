// src/pages/Welcome/styles.ts

import styled from "styled-components";

export const PoemContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: 0.8rem;
  }
`;

export const SpecialText = styled.p`
  display: inline-block;
  color: ${({ theme }) => theme.colors.text};
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  font-weight: 600;
`;

export const Author = styled.i`
  display: block;
  margin-top: 0.5rem;
  color: ${({ theme }) => theme.colors.text};
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  font-weight: 600;
`;
