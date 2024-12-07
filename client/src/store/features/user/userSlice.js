import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null, // Obiectul utilizatorului conectat
  isLoading: false, // Pentru a monitoriza încărcarea
  error: null, // Pentru erorile legate de user
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
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
