// src/pages/Feed/SettingsPage/index.tsx

import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux"; // Importe useDispatch
import { useQueryClient } from "@tanstack/react-query";

import { AppDispatch } from "../../../store/store";
import { logout } from "../../../store/slices/authSlice";

import FeedHeader from "../../../components/FeedHeader";

import { FeedHeaderTextContent, BackLink } from "../../../components/FeedHeader/styles";
import { SettingsContainer, SettingsOption } from "./styles";
import { FaArrowLeft, FaSignOutAlt } from "react-icons/fa";

const Settings = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const queryClient = useQueryClient();

  return (
    <SettingsContainer>
      <FeedHeader>
        <BackLink to="/home">
          <FaArrowLeft />
        </BackLink>
        <FeedHeaderTextContent>
          <h1>Settings</h1>
        </FeedHeaderTextContent>
      </FeedHeader>

      <SettingsOption onClick={() => navigate("/settings/edit-profile")}>
        Edit Profile Info
      </SettingsOption>

      <SettingsOption onClick={() => {
        dispatch(logout());
        queryClient.clear();
        navigate("/login", {replace: true});
      }}>
        Logout
        <FaSignOutAlt />
      </SettingsOption>

      <SettingsOption onClick={() => navigate("/settings/change-password")}>
        Change Password
      </SettingsOption>

      <SettingsOption onClick={() => navigate("/settings/delete-account")}>
        Delete Account
      </SettingsOption>
    </SettingsContainer>
  );
};

export default Settings;
