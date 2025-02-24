import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  list: [],
};

const requestSlice = createSlice({
  name: "requests",
  initialState,
  reducers: {
    setRequests(state, action) {
      state.list = action.payload;
    },
  },
});

export const { setRequests } = requestSlice.actions;
export default requestSlice.reducer;
