import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/user/userSlice";
import projectReducer from "./features/projects/projectSlice";
import requestReducer from "./features/requests/requestSlice";
import errorReducer from "./features/error/errorSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    projects: projectReducer,
    requests: requestReducer,
    error: errorReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

export default store;
