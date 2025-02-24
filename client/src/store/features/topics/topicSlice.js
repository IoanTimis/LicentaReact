import { createSlice } from "@reduxjs/toolkit";

const topicSlice = createSlice({
  name: "topics",
  initialState: {
    list: [],
    filteredList: [],
  },
  reducers: {
    setTopics(state, action) {
      state.list = action.payload.map(topic => ({
        ...topic,
        isRequested: false
      }));
      state.filteredList = state.list;
    },
    addTopic(state, action) {
      state.list.push(action.payload);
      state.filteredList.push(action.payload);
    },
    updateTopic(state, action) {
      const updatedTopic = action.payload;
      state.list = state.list.map(topic =>
        topic.id === updatedTopic.id ? updatedTopic : topic
      );
      state.filteredList = state.filteredList.map(topic =>
        topic.id === updatedTopic.id ? updatedTopic : topic
      );
    },
    deleteTopic(state, action) {
      const topicId = action.payload;
      state.list = state.list.filter(topic => topic.id !== topicId);
      state.filteredList = state.filteredList.filter(topic => topic.id !== topicId);
    },
    setFilteredTopics(state, action) {
      state.filteredList = action.payload;
    },
    resetFilter(state) {
      state.filteredList = state.list;
    }
  }
});

export const { setTopics, addTopic, updateTopic, deleteTopic, setFilteredTopics, resetFilter } = topicSlice.actions;
export default topicSlice.reducer;
