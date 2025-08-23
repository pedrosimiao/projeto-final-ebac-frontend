// src/components/Sidebar/styles.ts

import styled from "styled-components";

export const SidebarContainer = styled.aside`
  position: sticky;
  top: 0;

  /* width: 25vw; */
  width: 25vw;
  flex: 0 1 25vw;
  min-width: 0;

  height: 100vh;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-right: 2px solid ${({ theme }) => theme.colors.border};
  /* flex-shrink: 0; */
  overflow: hidden;

  @media (max-width: ${({ theme }) => theme.breakpoints.desktop}) {
    width: 96px;
    min-width: 96px;
    padding: 0.5rem;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    width: 115px;
    min-width: 115px;
  }

  // MOBILE: forçar barra inferior
  @media (max-width: 460px) {
    && {
      position: fixed !important;
      /* inset: auto 0 0 0; */
      top: auto;
      bottom: 0;
      left: 0;
      right: 0;
      width: 100%;
      max-width: none;
      min-width: 0;
      height: 60px;

      flex: none;
      z-index: 9999;

      display: flex;
      flex-direction: row;
      align-items: center;
      /* justify-content: space-between; */
      justify-content: center;

      background-image: ${({ theme }) => theme.colors.backgroundGradient};
      border-right: none;
      border-top: 2px solid ${({ theme }) => theme.colors.border};
      padding: 0 1.3rem;

      transform: translateZ(0);
      will-change: transform;
    }
  }
`;

export const InnerContainer = styled.div`
  width: 230px;
  display: flex;
  flex-direction: column;

  @media (max-width: 460px) {
    /* display: flex; */
    /* flex-direction: row; */
    width: 100%;
    /* align-items: center; */
    /* justify-content: center; */

    img {
      display: none;
    }
  }
`;

export const LogoWrapper = styled.div`
  margin-bottom: 2rem;
  width: 100%;
  display: flex;
  justify-content: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.desktop}) and (min-width: 426px) {
    margin-bottom: 1rem;
  }

  @media (max-width: 425px) {
    display: none;
  }
`;

export const NavList = styled.ul`
  width: 100%;
  list-style: none;
  padding: 0;
  margin: 0;

  @media (max-width: 460px) {
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    gap: 0.5rem;
  }
`;

export const NavItem = styled.li`
  width: 100%;
  margin-bottom: 1.5rem;

  @media (max-width: 460px) {
    width: auto;
    /* flex: 1; */
    display: flex;
    justify-content: center;
  }

  a {
    display: flex;
    align-items: center;
    text-decoration: none;
    color: ${({ theme }) => theme.colors.text};
    font-weight: 600;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    transition: color 0.3s ease;

    &:hover {
      color: ${({ theme }) => theme.colors.accent};
    }

    svg {
      margin-right: 0.7rem;
      font-size: 1.5rem;
      filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.5));
    }

    @media (max-width: ${({ theme }) => theme.breakpoints.desktop}) and (min-width: 464px) {
      justify-content: center;

      span {
        display: none;
      }
    }

    @media (max-width: 460px) {
      flex-direction: column;

      span {
        display: none;
      }

      svg {
        margin-top: 1.3rem;
        margin-right: 0;
      }
    }
  }
`;

export const PostButtonContainer = styled.div`
  width: 230px;
  margin-top: auto;
  display: flex;
  justify-content: center;

  @media (max-width: 1024px) and (min-width: 426px) {
    width: 100%;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    display: none;
  }
`;

/* Botão "Post" */
export const PostButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: ${({ theme }) => theme.colors.text};
  color: ${({ theme }) => theme.colors.background};
  border: none;
  border-radius: 24px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-size: 1rem;
  font-weight: 600;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: ${({ theme }) => theme.colors.accent};
  }

  @media (min-width: 1025px) {
    svg {
      display: none;
    }
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    span {
      display: inline;
      margin-left: 0.5rem;
    }
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.desktop}) {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    padding: 0;

    span {
      display: none;
    }
  }

  @media (max-width: 460px) {
    display: none;
  }
`;

export const MobilePostButton = styled.button`
  position: fixed !important;
  bottom: 68px;
  right: 1.5rem;
  z-index: 9998;
  background-color: ${({ theme }) => theme.colors.text};
  color: ${({ theme }) => theme.colors.background};
  border: none;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  /* display: none; */
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  cursor: pointer;

  /*
  @media (max-width: 460px) {
    display: flex;
    align-items: center;
    justify-content: center;
  } */
`;

export const NotificationBadge = styled.div`
  position: absolute;
  top: -6px;
  right: 0;
  background-color: red;
  color: white;
  font-size: 0.7rem;
  font-weight: bold;
  border-radius: 50%;
  padding: 2px 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.background};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    top: 18px;
    right: -8px;
  }
`;

export const BellWrapper = styled.div`
  position: relative;
  display: inline-block;

  svg {
    position: relative;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0;
  }
`;
