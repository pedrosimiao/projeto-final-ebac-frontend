// src/pages/feed/styles.ts

import styled from "styled-components";

export const PageContainer = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
  overflow-y: auto;

  @media (max-width: 460px) {
    flex-direction: column;
    height: calc(100vh - 60px);
  }
`;
