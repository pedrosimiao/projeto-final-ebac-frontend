// src/components/FeedContent/styles.ts

import styled from "styled-components";

export const FeedContainer = styled.main`
  /* width: 600px; */
  flex: 0 1 600px;
  max-width: 100%;
  min-height: 100vh;
  /* flex-grow: 0; */
  position: relative;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-basis: 100%;
  }
`;
