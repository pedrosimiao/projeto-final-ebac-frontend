// src/store/store.ts

import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./slices/authSlice";
import replyReducer from "./slices/replySlice";
import retweetReducer from "./slices/retweetSlice"

const store = configureStore({
  reducer: {
    auth: authReducer,
    reply: replyReducer,
    retweet: retweetReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
