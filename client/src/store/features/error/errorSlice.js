import { createSlice } from "@reduxjs/toolkit";
console.log("errorSlice.js");

const initialState = {
  message: null, // Mesajul de eroare
};

const errorSlice = createSlice({
  name: "error",
  initialState,
  reducers: {
    setError: (state, action) => {
      state.message = action.payload;
      console.error("Eroare:", action.payload);
    },
    clearError: (state) => {
      state.message = null;
    },
  },
});

export const { setError, clearError } = errorSlice.actions;

export default errorSlice.reducer;
