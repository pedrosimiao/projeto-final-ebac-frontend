// src/pages/Feed/Follows/styles.ts

import styled from "styled-components";

export const FollowsContainer = styled.div`
  width: 100%;
  /* max-width: 600px; */
  height: calc(100vh - 60px);
  margin-top: 3.25rem;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.background};
`;
