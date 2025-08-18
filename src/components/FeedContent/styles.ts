// src/components/FeedContent/styles.ts

import styled from "styled-components";

export const FeedContainer = styled.main`
  flex-grow: 0;
  min-height: 100vh;
  position: relative;
  
  // Define a largura máxima de 600px, mas mantém-a fluida em 100% para telas menores
  max-width: 600px;
  width: 100%;

  // Centraliza o feed horizontalmente
  margin: 0 auto;
`;
