import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null, // Obiectul utilizatorului conectat
  isLoading: false, // Pentru a monitoriza încărcarea
  error: null, // Pentru erorile legate de user
  accessToken: null, // Token-ul de acces JWT
  isSessionChecked: false, // Pentru a verifica dacă sesiunea a fost verificată
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload.user;
      state.isSessionChecked = true;
      state.accessToken = action.payload.accessToken;
    },
    clearUser(state) {
      state.user = null;
      state.accessToken = null;
      state.isSessionChecked = true;
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
