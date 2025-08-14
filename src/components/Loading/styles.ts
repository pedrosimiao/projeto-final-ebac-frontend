// src/components/Loading/styles.ts

import styled, { keyframes } from "styled-components";
import { FaSpinner } from "react-icons/fa";


const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

interface SpinnerContainerProps {
  $spinnerColor?: "text" | "background" | "accent";
}

export const SpinnerContainer = styled.div<SpinnerContainerProps>`
  color: ${({ theme, $spinnerColor }) => {
    switch ($spinnerColor) {
      case "background":
        return theme.colors.background;
      case "accent":
        return theme.colors.accent;
      case "text":
      default:
        return theme.colors.text;
    }
  }};
`;

interface SpinnerIconProps {
  $size?: string;
}

export const SpinnerIcon = styled(FaSpinner)<SpinnerIconProps>`
  animation: ${spin} 1s linear infinite;
  font-size: ${({ $size }) => $size || "1.5rem"};
`;


export const ListLoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 0;
  min-height: 50px;
  /* border-bottom: 1px solid ${({ theme }) => theme.colors.border}; */
  /* background-color: ${({ theme }) => theme.colors.background}; */
  padding-left: 3rem;
  padding-right: 3rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.smallest}) {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }

  & > div {
    text-align: center;
    color: ${({ theme }) => theme.colors.accent};
  }
`;
