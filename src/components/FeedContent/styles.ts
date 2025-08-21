// src/components/FeedContent/styles.ts

import styled from "styled-components";

export const FeedContainer = styled.main`
  width: 600px;
  min-height: 100vh;
  flex-grow: 0;
  position: relative;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    width: 100%;
  }
`;
