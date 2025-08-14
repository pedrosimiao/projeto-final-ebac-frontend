// src/components/AuthLinks/styles.ts

import styled from "styled-components";

const AuthLinksContainer = styled.div`
  align-self: flex-end;
  margin-right: 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: 0.8rem;
    margin-right: 0.5rem;
    gap: 0.5rem;
  }

  a {
    color: ${({ theme }) => theme.colors.text};
    font-weight: 600;
    text-decoration: none;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    transition:
      color 0.3s ease,
      transform 0.3s ease;

    &:hover {
      transform: translateY(-3px);
    }

    &::after {
      content: "";
      position: absolute;
      width: 0;
      height: 2px;
      bottom: -2px;
      left: 0;
      transition: width 0.3s ease;
    }
    &:hover::after {
      width: 100%;
    }
  }
`;

export default AuthLinksContainer;
