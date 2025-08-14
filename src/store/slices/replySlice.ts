// src/store/replySlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IComment } from "../../types";

interface ReplyState {
  parentComment: IComment | null;
}

const initialState: ReplyState = {
  parentComment: null,
};

const replySlice = createSlice({
  name: "reply",
  initialState,
  reducers: {
    setParentComment: (state, action: PayloadAction<IComment>) => {
      state.parentComment = action.payload;
    },
    clearParentComment: (state) => {
      state.parentComment = null;
    },
  },
});

export const { setParentComment, clearParentComment } = replySlice.actions;
export default replySlice.reducer;
