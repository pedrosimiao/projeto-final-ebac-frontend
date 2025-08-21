//src/pages/Feed/Profile/styles.ts

import { Link } from "react-router-dom";

import styled from "styled-components";

export const ProfileContainer = styled.div`
  width: 100%;
  /* max-width: 600px; */
  margin: 0;
  /* padding-top: 3.25rem; */
  padding-bottom: 0.3rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  border-bottom: 2px solid ${({ theme }) => theme.colors.border};
`;

export const CoverWrapper = styled.div`
  position: relative;
  width: 100%;
  height: auto;
`;


export const CoverImage = styled.img`
  width: 100%;
  height: auto;
  object-fit: cover;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
`;

export const ProfileInfo = styled.div`
  position: relative;
  display: block;
  margin-left: 1rem;

  filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.5));
`;

export const ActionsContainer = styled.div`
  position: absolute;
  top: 0.3rem;
  right: 1.3rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    top: 0.05rem;
    right: 0.5rem;
    gap: 0.3rem;
  }
`;

export const EditProfileButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: ${({ theme }) => theme.colors.text};
  color: ${({ theme }) => theme.colors.backgroundGradient};
  border: 1px solid ${({ theme }) => theme.colors.background};
  border-radius: 1.5rem;
  cursor: pointer;
  font-weight: bold;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

export const VisitedActionsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const ActionButton = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.text};
  color: ${({ theme }) => theme.colors.backgroundGradient};
  border: 1px solid ${({ theme }) => theme.colors.background};
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  text-decoration: none;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: 1.5rem;
    height: 1.5rem;
  }
`;

export const ProfilePicture = styled.img`
  margin-top: -64px;
  width: 120px;
  height: 120px;
  border: 3px solid white;
  border-radius: 50%;
  object-fit: cover;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: 80px;
    height: 80px;
  }
`;

export const UserName = styled.h1`
  font-size: 1.3rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 1.1rem;
  }
`;

export const UserHandle = styled.p`
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 0.5rem;
  font-size: 0.9rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 0.8rem;
    margin-bottom: 0.5rem;
  }
`;

export const StatsContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

export const StatItem = styled.div`
  font-size: 0.9rem;

  span {
    font-weight: 600;
  }
`;

export const BioContainer = styled.div`
  display: flex;
`;

export const AdditionalInfoContainer = styled.div`
  margin-bottom: 0.3rem;
`;

export const InfoItem = styled.div`
  display: inline-block;
  font-size: 0.6rem;
  margin-right: 0.5rem;

  svg {
    margin-right: 0.3rem;
    font-size: 0.6;
    color: ${({ theme }) => theme.colors.accent};
  }

  span {
    color: ${({ theme }) => theme.colors.text};
  }
`;

export const ProfileEditButton = styled.button`
  position: absolute;
  bottom: 0.75rem;
  right: 0;
  transform: translate(-25%, 25%);
  background-color: rgba(255, 255, 255, 0.8);
  color:  ${({ theme }) => theme.colors.background};
  border: 2px solid white;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.1rem;
  z-index: 1000;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: 24px;
    height: 24px;
  }
`;

export const CoverEditButton = styled.button`
  position: absolute;
  bottom: 1.5rem;
  right: 1rem;
  background-color: rgba(255, 255, 255, 0.8);
  color: ${({ theme }) => theme.colors.background};
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.1rem;
  z-index: 1000;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: 30px;
    height: 30px;
  }
`;

export const ProfilePictureWrapper = styled.div`
  position: relative;
  display: inline-block;
`;
