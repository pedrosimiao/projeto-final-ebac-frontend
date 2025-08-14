// src/pages/Login/styles.ts

import styled from "styled-components";

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
`;

export const Input = styled.input`
  width: 80%;
  padding: 0.75rem;
  font-size: 0.5;
  border: none;
  border-radius: 4px;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  caret-color: black;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    width: 100%;
  }
`;

export const Button = styled.button`
  min-width: 120px;
  padding: 0.75rem 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.text};
  color: ${({ theme }) => theme.colors.background};
  border: none;
  border-radius: 4px;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  &:hover {
    background-color: ${({ theme }) => theme.colors.accent};
  }
`;
