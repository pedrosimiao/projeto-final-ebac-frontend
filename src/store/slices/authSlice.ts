// src/store/slices/authSlice.ts

// armazenamento de tokens

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  isAuthChecked: boolean;
}

const accessFromStorage = localStorage.getItem("accessToken");
const refreshFromStorage = localStorage.getItem("refreshToken");

const initialState: AuthState = {
  accessToken: accessFromStorage,
  refreshToken: refreshFromStorage,
  isAuthChecked: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setTokens: (state, action: PayloadAction<{ accessToken: string; refreshToken?: string }>) => {
      state.accessToken = action.payload.accessToken;
      if (action.payload.refreshToken) {
        state.refreshToken = action.payload.refreshToken;
      }
      localStorage.setItem("accessToken", action.payload.accessToken);
      if (action.payload.refreshToken) {
        localStorage.setItem("refreshToken", action.payload.refreshToken);
      }
    },
    logout(state) {
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthChecked = true;

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      console.log("AuthSlice: [Reducer] Logout dispatch. Redefined state.");
    },
    setAuthChecked: state => {
      state.isAuthChecked = true;
      console.log("AuthSlice: [Reducer] isAuthChecked defined as true.");
    },
  },
});

export const { logout, setAuthChecked, setTokens } = authSlice.actions;
export default authSlice.reducer;
