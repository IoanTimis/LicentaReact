import { createSlice } from "@reduxjs/toolkit";

const topicSlice = createSlice({
  name: "topics",
  initialState: {
    list: [],
  },
  reducers: {
    setTopics(state, action) {
      state.list = action.payload;
    },

    addTopic(state, action) {
      state.list.push(action.payload);
    },

    updateTopic(state, action) {
      const updatedTopic = action.payload;
      state.list = state.list.map(topic =>
        topic.id === updatedTopic.id ? updatedTopic : topic
      );
    },

    deleteTopic(state, action) {
      const topicId = action.payload;
      state.list = state.list.filter(topic => topic.id !== topicId);
    },
  }
});

export const { setTopics, addTopic, updateTopic, deleteTopic } = topicSlice.actions;
export default topicSlice.reducer;
