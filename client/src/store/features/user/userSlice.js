import { createSlice } from "@reduxjs/toolkit";

//TODO transofrma in users si aici voi salva userii pt admin dashboard

const initialState = {
  user: null, 
  isLoading: false,
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
    }
  },
});

export const { setUser, clearUser, setLoading } = userSlice.actions;

export default userSlice.reducer;
