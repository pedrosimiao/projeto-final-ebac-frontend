// src/components/PostModal/styles.ts

import styled from "styled-components";

export const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  overflow-y: auto;
  padding-top: 2rem;
  padding-bottom: 2rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    height: calc(100vh - 60px);
  }
`;

export const ModalContent = styled.div`
  background-color: #fff;
  padding: 0.5rem;
  border-radius: 12px;
  width: 100%;
  max-width: 600px;
  margin-top: 5rem;
  overflow-y: auto;
  position: relative;

  overflow: visible;

  @media (max-width: ${({ theme }) => theme.breakpoints.desktop}) {
    max-width: 80%;
    margin-bottom: 2rem;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    margin-top: 1.5rem;
    margin-bottom: 1.5rem;
  }
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: transparent;
  font-size: 1.5rem;
  border: none;
  cursor: pointer;
  z-index: 1;
`;
