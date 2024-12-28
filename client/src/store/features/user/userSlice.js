import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null, 
  isLoading: false, // Pentru a monitoriza încărcarea
  error: null, 
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
      console.log("Am setat user in userSlice");
    },
    clearUser(state) {
      state.user = null;
    },
    setLoading(state, action) {
      state.isLoading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
  },
});

export const { setUser, clearUser, setLoading, setError } = userSlice.actions;

export default userSlice.reducer;
