import { createSlice } from "@reduxjs/toolkit";

const topicSlice = createSlice({
  name: "topics",
  initialState: {
    topics: [],
  },
  reducers: {
    setTopics(state, action) {
      state.topics = action.payload;
    },
  }
});

export const { setTopics } = topicSlice.actions;
export default topicSlice.reducer;
