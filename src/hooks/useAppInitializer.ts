// src/hooks/useAppInitializer.ts

// check if user is logged

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";

import { AppDispatch } from "../store/store";
import { setAuthChecked, logout } from "../store/slices/authSlice";

import { useRefreshToken } from "./useAuth";

export const useAppInitializer = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { mutateAsync: refreshTokenMutate, isPending: isRefreshingToken } = useRefreshToken();
  const queryClient = useQueryClient();
  const [isEffectCompleted, setIsEffectCompleted] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      const storedRefreshToken = localStorage.getItem("refreshToken");

      if (storedRefreshToken) {
        try {
          await refreshTokenMutate(storedRefreshToken);
          queryClient.invalidateQueries({ queryKey: ["currentUser"] });
          console.log("App Initializer: Token refreshed successfully.");
        } catch (error) {
          console.error("App Initializer: Failed to refresh token, logging out.", error);
          dispatch(logout());
          queryClient.clear();
        }
      } else {
        console.log("App Initializer: No refresh token found, user is not authenticated.");
        dispatch(logout());
        queryClient.clear();
      }

      dispatch(setAuthChecked());
      setIsEffectCompleted(true);
    };

    initializeApp();
  }, [dispatch, refreshTokenMutate, queryClient]);

  const isLoading = isRefreshingToken || !isEffectCompleted;
  return { isLoading };
};
