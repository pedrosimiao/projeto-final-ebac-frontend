// src/app/MainRoutesContent/index.tsx

import React from 'react';
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "../../store/store";
import { logout } from '../../store/slices/authSlice';

import { useCurrentUserProfile } from "../../hooks/useUsers";

import Welcome from "../../pages/Welcome";
import Login from "../../pages/Login";
import SignUp from "../../pages/SignUp";

import Feed from "../../pages/Feed";
import Home from "../../pages/Feed/Home";
import Profile from "../../pages/Feed/Profile";
import StatusPage from "../../pages/Feed/Status";
import Settings from "../../pages/Feed/SettingsPage";
import EditProfilePage from "../../pages/Feed/EditProfilePage";
import ChangePasswordPage from "../../pages/Feed/ChangePasswordPage";
import DeleteProfilePage from "../../pages/Feed/DeleteProfilePage";
import Notifications from "../../pages/Feed/Notifications";
import FollowsPage from "../../pages/Feed/Follows";
import Explore from "../../pages/Feed/Explore";

import FullScreenLoader from "../../components/FullScreenLoader";
import PostModal from "../../components/PostModal";
import DeleteModal from "../../components/DeleteModal";

// ProtectedRoute (auth via redux)
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { accessToken } = useSelector((state: RootState) => state.auth);

  const {
    data: currentUser,
    isLoading: isCurrentUserLoading,
    isError: isCurrentUserError }
    = useCurrentUserProfile(!!accessToken);

  if (!accessToken) {
    console.log("ProtectedRoute: No accessToken. Redirecting to login page.");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (isCurrentUserLoading) {
    console.log("ProtectedRoute: Active accessToken, loading currentUser...");
    return <FullScreenLoader $spinnerColor="text" size="3rem" />
  }

  if (isCurrentUserError || !currentUser) {
    console.error("ProtectedRoute: Error loading currentUser. currentUser is null/undefined. Loging out.");
    dispatch(logout()); // forçando o logout no Redux e limpando o cache do TanStack Query (via onError do useRefreshToken)
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  console.log("ProtectedRoute: User authenticaded:", currentUser.username);

  return <>{children}</>;
};

const MainRoutesContent = () => {
  const location = useLocation();
  const background = location.state?.background;

  return (
    <>
      <Routes location={background || location}>
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Feed />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<Home />} />
          <Route path=":username" element={<Profile />} />

          <Route path="status/post/:postId" element={<StatusPage />} />
          <Route path="status/comment/:commentId" element={<StatusPage />} />

          <Route path="settings" element={<Settings />} />
          <Route path="settings/edit-profile" element={<EditProfilePage />} />
          <Route path="settings/change-password" element={<ChangePasswordPage />} />
          <Route path="settings/delete-account" element={<DeleteProfilePage />} />

          <Route path="notifications" element={<Notifications />} />
          <Route path="explore" element={<Explore />} />

          <Route path=":username/followers" element={<FollowsPage />} />
          <Route path=":username/following" element={<FollowsPage />} />
        </Route>

        {/* Catch-all route not found 404*/}
        <Route path="*" element={<h1>404 - Page not found</h1>} />
      </Routes>

      {/* Rotas dos modais (render sobre as rotas principais) */}
      {background && (
        <Routes>
          <Route path="compose/post" element={<PostModal mode="post" />} />
          <Route path="compose/reply/:postId" element={<PostModal mode="reply" />} />
          <Route path="delete/post/:postId" element={<DeleteModal type="post" />} />
          <Route path="delete/comment/:commentId" element={<DeleteModal type="comment" />} />
        </Routes>
      )}
    </>
  );
};

export default MainRoutesContent;
