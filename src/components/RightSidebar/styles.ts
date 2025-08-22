// src/components/RightSidebar/styles.ts

import styled from "styled-components";

export const RightSidebarContainer = styled.aside`
  position: sticky;
  top: 0;

  /* width: 30vw; */
  flex: 1 1 30vw;
  min-width: 0;

  height: 100dvh;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  overflow: hidden;
  flex-shrink: 0;
  border-left: 2px solid ${({ theme }) => theme.colors.border};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-basis: auto;
    width: auto;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    display: none;
  }
`;

export const RightSidebarCard = styled.div`
  padding: 0.3rem 1rem;
  max-width: 350px;
  width: 80%;
  align-items: center;
  justify-content: space-between;
  background-color: ${({ theme }) => theme.colors.text};
  color: ${({ theme }) => theme.colors.background};
  border: 1px solid white;
  border-radius: 16px;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);

  @media (max-width: ${({ theme }) => theme.breakpoints.desktop}) {
    max-width: 290px;
    font-size: 0.8rem;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: none;
  }
`;

export const RightSidebarCardTitle = styled.div`
  display: flex;
  justify-content: center;
  padding: 2rem auto;
  margin-top: 0.5rem;
`;


export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const UserAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;

  @media (max-width: ${({ theme }) => theme.breakpoints.desktop}) {
    width: 32px;
    height: 32px;
  }
`;


export const SuggestionList = styled.ul`
  width: 100%;
  list-style: none;
  padding: 0;
  margin-top: 1rem;
`;

export const SuggestionItem = styled.li`
  margin-bottom: 0.75rem;
`;

export const SuggestionRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 2rem auto;
`;


export const FollowButton = styled.button`
  font-size: 0.8rem;
  padding: 0.4rem 0.8rem;
  background-color: ${({ theme }) => theme.colors.background};
  color: white;
  border: 2px solid #bf00ff;
  border-radius: 16px;
  box-shadow: 1px 1.5px rgba(0, 0, 0, 0.5);
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.desktop}) {
    padding: 0.2rem 0.4rem;
  }
`;


export const TrendList = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 1rem;
`;

export const TrendItem = styled.li`
  margin-bottom: 0.5rem;
  font-size: 1rem;
  cursor: pointer;

  strong {
    display: block;
    color: ${({ theme }) => theme.colors.link};

    &:hover {
      text-decoration: underline;
    }
  }
`;
