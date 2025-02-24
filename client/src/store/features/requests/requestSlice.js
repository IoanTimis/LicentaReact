import { createSlice } from "@reduxjs/toolkit";

const requestSlice = createSlice({
  name: "requests",
  initialState: {
    list: [],
    filteredList: [],
  },
  reducers: {
    setRequests(state, action) {
      state.list = action.payload;
      state.filteredList = state.list
    },
    addRequest(state, action) {
      state.list.push(action.payload);
      state.filteredList.push(action.payload);
    },
    updateRequest(state, action) {
      const updatedRequest = action.payload;
      state.list = state.list.map((request) =>
        request.id === updatedRequest.id ? updatedRequest : request
      );
      state.filteredList = state.filteredList.map((request) =>
        request.id === updatedRequest.id ? updatedRequest : request
      );
    },
    deleteRequest(state, action) {
      const requestId = action.payload;
      state.list = state.list.filter((request) => request.id !== requestId);
      state.filteredList = state.filteredList.filter((request) => request.id !== requestId
      ); 
    },
    setFilteredRequests(state, action) {
      state.filteredList = action.payload
    },
    resetFilter(state) {
      state.filteredList = state.list
    }
  },
});

export const { setRequests, addRequest, updateRequest, deleteRequest, setFilteredRequests, resetFilter } = requestSlice.actions;
export default requestSlice.reducer;
