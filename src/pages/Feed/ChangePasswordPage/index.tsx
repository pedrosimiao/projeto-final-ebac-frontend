// src/pages/Feed/ChangePasswordPage/index.tsx

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

import { useChangePassword } from "../../../hooks/useUsers";

import { logout } from "../../../store/slices/authSlice";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import FeedHeader from "../../../components/FeedHeader";

import { FaArrowLeft } from "react-icons/fa";

import { BackLink, FeedHeaderTextContent } from "../../../components/FeedHeader/styles";

import {
  SettingsPageContainer,
  FormContainer,
  Input,
  Label,
  ButtonGroup,
  SaveButton,
  CancelButton,
  FieldGroup,
} from "../EditProfilePage/styles";


const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "New password must be at least 8 characters"),
    confirmNewPassword: z.string().min(8, "Please confirm the new password"),
  })
  .refine(data => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  });

type ChangePasswordInputs = z.infer<typeof changePasswordSchema>;

const ChangePasswordPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    mutate: changePasswordMutate,
    isPending: changePasswordLoading,
    isSuccess: changePasswordSuccess,
    isError: hasChangePasswordError,
    error: changePasswordError,
    reset: resetChangePasswordMutation,
  } = useChangePassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordInputs>({
    resolver: zodResolver(changePasswordSchema),
  });

  useEffect(() => {
    if (changePasswordSuccess) {
      alert("Password changed successfully! You will be logged out to sign in with your new password.");
      reset();
      resetChangePasswordMutation();

      dispatch(logout());
      navigate("/login", { replace: true });
    }
  }, [changePasswordSuccess, navigate, reset, resetChangePasswordMutation, dispatch]);

  useEffect(() => {
    if (hasChangePasswordError) {
      alert(changePasswordError || "An error occurred while changing password.");
      resetChangePasswordMutation();
    }
  }, [hasChangePasswordError, changePasswordError, resetChangePasswordMutation]);

  const onSubmit = (data: ChangePasswordInputs) => {
    changePasswordMutate({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
      confirmNewPassword: data.confirmNewPassword,
    });
  };

  return (
    <SettingsPageContainer>
      <FeedHeader>
        <BackLink to="/settings">
          <FaArrowLeft />
        </BackLink>
        <FeedHeaderTextContent>
          <h1>Change password</h1>
        </FeedHeaderTextContent>
      </FeedHeader>

      <FormContainer onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup>
          <Label>Current Password</Label>
          <Input type="password" {...register("currentPassword")} />
          {errors.currentPassword && <p>{errors.currentPassword.message}</p>}
        </FieldGroup>

        <FieldGroup>
          <Label>New Password</Label>
          <Input type="password" {...register("newPassword")} />
          {errors.newPassword && <p>{errors.newPassword.message}</p>}
        </FieldGroup>

        <FieldGroup>
          <Label>Confirm New Password</Label>
          <Input type="password" {...register("confirmNewPassword")} />
          {errors.confirmNewPassword && <p>{errors.confirmNewPassword.message}</p>}
        </FieldGroup>

        <ButtonGroup>
          <CancelButton type="button" onClick={() => navigate("/settings")}>
            Cancel
          </CancelButton>
          <SaveButton type="submit" disabled={changePasswordLoading}>
            {changePasswordLoading ? "Saving..." : "Save"}
          </SaveButton>
        </ButtonGroup>
      </FormContainer>
    </SettingsPageContainer>
  );
};

export default ChangePasswordPage;
