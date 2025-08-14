// src/components/AuthLayout/styles.ts

import styled from "styled-components";
import { motion } from "framer-motion";

/* Container principal que centraliza todo o conteúdo da página */
export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.5rem;
  min-height: 100vh;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 1rem;
  }
`;

export const ContentContainer = styled.div`
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    max-width: 90%;
    padding-top: 2rem;
  }
`;

/* Wrapper animado para o conteúdo que muda (poema ou formulário) */
export const AnimatedContent = styled(motion.div)`
  margin: 0 auto;
  width: 80%;
  padding-top: 1rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding-top: 0.5rem;
  }
`;
