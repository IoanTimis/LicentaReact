import { createSlice } from "@reduxjs/toolkit";

const requestSlice = createSlice({
  name: "requests",
  initialState: {
    list: [],
  },
  reducers: {
    setRequests(state, action) {
      state.list = action.payload;
    },
    addRequest(state, action) {
      state.list.push(action.payload);
    },
    updateRequest(state, action) {
      const updatedRequest = action.payload;
      state.list = state.list.map((request) =>
        request.id === updatedRequest.id ? updatedRequest : request
      );
    },
    deleteRequest(state, action) {
      const requestId = action.payload;
      state.list = state.list.filter((request) => request.id !== requestId); 
    },
  },
});

export const { setRequests, addRequest, updateRequest, deleteRequest } = requestSlice.actions;
export default requestSlice.reducer;
