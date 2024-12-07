import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  requests: [],
};

const requestSlice = createSlice({
  name: "requests",
  initialState,
  reducers: {
    setRequests(state, action) {
      state.requests = action.payload;
    },
  },
});

export const { setRequests } = requestSlice.actions;

export default requestSlice.reducer;
