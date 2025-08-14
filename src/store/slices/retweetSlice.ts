// src/store/retweetSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IPost } from "../../types";

interface RetweetState {
  targetPost: IPost | null;
}

const initialState: RetweetState = {
  targetPost: null,
};

const retweetSlice = createSlice({
  name: "retweet",
  initialState,
  reducers: {
    setRetweetPost: (state, action: PayloadAction<IPost>) => {
      state.targetPost = action.payload;
    },
    clearRetweetPost: state => {
      state.targetPost = null;
    },
  },
});

export const { setRetweetPost, clearRetweetPost } = retweetSlice.actions;
export default retweetSlice.reducer;
