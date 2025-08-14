// src/pages/EditProfilePage/index.tsx

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import imageCompression from 'browser-image-compression';

import React, { useCallback, useEffect, useRef, useState } from "react";

import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { useCurrentUserProfile, useUpdateUserProfile } from "../../../hooks/useUsers"

import FeedHeader from "../../../components/FeedHeader";
import { BackLink, FeedHeaderTextContent } from "../../../components/FeedHeader/styles";

import defaultAvatar from "../../../assets/default-avatar.png"

import { FaArrowLeft, FaCameraRetro } from "react-icons/fa";

import {
  ButtonGroup,
  CancelButton,
  CoverContainer,
  CoverImage,
  CoverUploadButton,
  CoverUploadInput,
  FieldGroup,
  FormContainer,
  Input,
  Label,
  SettingsPageContainer,
  ProfilePicture,
  ProfilePictureWrapper,
  ProfileUploadButton,
  ProfileUploadInput,
  SaveButton,
  TextArea,
} from "./styles";

// zod schema
const editProfileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  bio: z.string().max(160).optional(),
  occupation: z.string().optional(),
  location: z.string().optional(),
  birth_date: z.string().optional(),
});

type EditProfileData = z.infer<typeof editProfileSchema>;

const EditProfilePage = () => {
  const navigate = useNavigate();
  const {
    data: currentUser,
    isLoading: isCurrentUserLoading, // 'isLoading' para queries
    error: currentUserError
  } = useCurrentUserProfile();

  const {
    mutate: updateProfileMutate,
    isPending: updateProfileLoading,
    isSuccess: updateProfileSuccess,
    isError: hasUpdateProfileError,
    // error: updateProfileError,
    reset: resetUpdateProfileMutation
  } = useUpdateUserProfile();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<EditProfileData>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      bio: "",
      occupation: "",
      location: "",
      birth_date: "",
    },
  });

  const [compressedCoverFile, setCompressedCoverFile] = useState<File | null>(null);
  const [compressedProfileFile, setCompressedProfileFile] = useState<File | null>(null);

  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);

  const [visibleError, setVisibleError] = useState<string | null>(null);

  const coverInputRef = useRef<HTMLInputElement>(null);
  const profileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (currentUser) {
      setValue("firstName", currentUser.firstName || "");
      setValue("lastName", currentUser.lastName || "");
      setValue("bio", currentUser.bio || "");
      setValue("occupation", currentUser.occupation || "");
      setValue("location", currentUser.location || "");
      setValue("birth_date", currentUser.birth_date || "");

      setCoverPreview(currentUser.cover_image || null);
      setProfilePreview(currentUser.profile_picture || defaultAvatar);
    }
  }, [currentUser, setValue]);

  useEffect(() => {
    if (updateProfileSuccess && currentUser?.username) {
      navigate(`/${currentUser.username}`);
      resetUpdateProfileMutation();

    }
  }, [updateProfileSuccess, currentUser, navigate, resetUpdateProfileMutation]);

  // exibir erros da mutação.
  useEffect(() => {
    if (hasUpdateProfileError) {
      setVisibleError("Failed to update profile. Please try again.");

      const timer = setTimeout(() => {
        setVisibleError(null);
        resetUpdateProfileMutation();
      }, 8000);
      return () => clearTimeout(timer);
    } else {
      setVisibleError(null);
    }
  }, [hasUpdateProfileError, resetUpdateProfileMutation]);


  const handleImageChange = useCallback(
    async (
      e: React.ChangeEvent<HTMLInputElement>,
      setCompressedFile: React.Dispatch<React.SetStateAction<File | null>>,
      setPreview: React.Dispatch<React.SetStateAction<string | null>>
    ) => {
      const file = e.target.files?.[0];
      if (file) {
        const originalName = file.name;
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        };
        try {
          const compressedImage = await imageCompression(file, options);
          const newCompressedFile = new File([compressedImage], originalName, { type: compressedImage.type });
          setCompressedFile(newCompressedFile);
          setPreview(URL.createObjectURL(newCompressedFile));
        } catch (error) {
          console.error('Error compressing image:', error);
          setCompressedFile(file);
          setPreview(URL.createObjectURL(file));
        }
      } else {
        setCompressedFile(null);
        setPreview(null);
      }
    },
    []
  );

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleImageChange(e, setCompressedCoverFile, setCoverPreview);
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleImageChange(e, setCompressedProfileFile, setProfilePreview);
  };


  const onSubmit = (data: EditProfileData) => {
    const payload = {
      ...data,
      profile_picture: compressedProfileFile,
      cover_image: compressedCoverFile,
    };
    // dispatch(updateUserProfile(payload));
    updateProfileMutate(payload)
  };

  // Loader universal
  if (isCurrentUserLoading) {
    return <div>Carregando dados do perfil...</div>;
  }

  if (currentUserError) {
    return <div>Error loading the page: {currentUserError}</div>;
  }

  return (
    <SettingsPageContainer>
      <FeedHeader>
        <BackLink to="/settings">
          <FaArrowLeft />
        </BackLink>
        <FeedHeaderTextContent>
          <h1>Edit profile</h1>
        </FeedHeaderTextContent>
      </FeedHeader>

      <CoverContainer>

        {coverPreview ? (
          <CoverImage src={coverPreview} alt="Cover" />
        ) : (
          <CoverImage
            as="div"
            style={{
              background: "linear-gradient(to right, #ffffff, #aaaaaa)",
              height: "200px",
            }}
          />
        )}

        <CoverUploadInput
          type="file"
          accept="image/*"
          ref={coverInputRef}
          onChange={handleCoverChange}
        />
        <CoverUploadButton onClick={() => coverInputRef.current?.click()}>
          <FaCameraRetro />
        </CoverUploadButton>
      </CoverContainer>

      <ProfilePictureWrapper>
        {profilePreview && <ProfilePicture src={profilePreview} alt="Profile" />}

        <ProfileUploadInput
          type="file"
          accept="image/*"
          ref={profileInputRef}
          onChange={handleProfileChange}
        />
        <ProfileUploadButton onClick={() => profileInputRef.current?.click()}>
          <FaCameraRetro />
        </ProfileUploadButton>
      </ProfilePictureWrapper>

      <FormContainer onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup>
          <Label>First Name</Label>
          <Input {...register("firstName")} />
          {errors.firstName && <span>{errors.firstName.message}</span>}
        </FieldGroup>

        <FieldGroup>
          <Label>Last Name</Label>
          <Input {...register("lastName")} />
          {errors.lastName && <span>{errors.lastName.message}</span>}
        </FieldGroup>

        <FieldGroup>
          <Label>Bio</Label>
          <TextArea rows={3} {...register("bio")} />
          {errors.bio && <span>{errors.bio.message}</span>}
        </FieldGroup>

        <FieldGroup>
          <Label>Occupation</Label>
          <Input {...register("occupation")} />
        </FieldGroup>

        <FieldGroup>
          <Label>Location</Label>
          <Input {...register("location")} />
        </FieldGroup>

        <FieldGroup>
          <Label>Birth Date</Label>
          <Input type="date" {...register("birth_date")} />
        </FieldGroup>

        <ButtonGroup>
          <CancelButton type="button" onClick={() => navigate("/settings")}>
            Cancel
          </CancelButton>
          <SaveButton type="submit" disabled={updateProfileLoading}>
            {updateProfileLoading ? "Saving..." : "Save"}
          </SaveButton>
          {visibleError && <span>{visibleError}</span>}
        </ButtonGroup>
      </FormContainer>
    </SettingsPageContainer>
  );
};

export default EditProfilePage;
