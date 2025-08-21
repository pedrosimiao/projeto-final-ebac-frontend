// src/pages/Feed/EditProfilePage/styles.ts

import styled from "styled-components";

export const SettingsPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 600px;
  height: calc(100vh - 60px);
  margin: 0 auto;
  /* padding-top: 3.25rem; */
`;

export const HeaderText = styled.h2`
  font-size: 20px;
  font-weight: bold;
`;

export const CoverContainer = styled.div`
  position: relative;
  height: 150px;
  background-color: #f2f2f2;
`;

export const CoverImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const CoverUploadInput = styled.input`
  display: none;
`;

export const CoverUploadButton = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 1rem;
  background: rgba(255, 255, 255, 0.9);
  color: ${({ theme }) => theme.colors.background};
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  font-size: 1.2rem;
  cursor: pointer;
`;

export const ProfilePictureWrapper = styled.div`
  position: relative;
  width: 96px;
  height: 96px;
  margin-top: -48px;
  margin-left: 16px;
  border: 4px solid white;
  border-radius: 9999px;
  background-color: #ddd;
`;

export const ProfilePicture = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 9999px;
  object-fit: cover;
`;

export const ProfileUploadInput = styled.input`
  display: none;
`;

export const ProfileUploadButton = styled.button`
  position: absolute;
  bottom: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.9);
  color: ${({ theme }) => theme.colors.background};
  border: 1px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  border-radius: 50%;
  padding: 4px;
  cursor: pointer;
`;

export const FormContainer = styled.form`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 4px;
`;

export const Input = styled.input`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 8px;
  caret-color: black;
`;

export const TextArea = styled.textarea`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 8px;
  resize: vertical;
  caret-color: black;
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;

export const SaveButton = styled.button`
  background-color: ${({ theme }) => theme.colors.text};
  color: black;
  border: 1px solid ${({ theme }) => theme.colors.background};
  padding: 10px 18px;
  border-radius: 20px;
  font-weight: 600;
  cursor: pointer;
`;

export const CancelButton = styled.button`
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid #ccc;
  padding: 10px 18px;
  border-radius: 20px;
  font-weight: 600;
  cursor: pointer;
`;
