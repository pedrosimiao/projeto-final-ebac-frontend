// src/components/FeedContent/styles.ts

import styled from "styled-components";

export const FeedContainer = styled.main`
  flex: 1 1 600px;
  width: min(600px, 100%);
  min-width: 0;
  min-height: 100dvh;
  position: relative;
  padding-top: 3.25rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-basis: 100%;
  }
`;
