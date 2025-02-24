import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/user/userSlice";
import topicReducer from "./features/topics/topicSlice";
import requestReducer from "./features/requests/requestSlice";
import errorReducer from "./features/error/errorSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    topics: topicReducer,
    requests: requestReducer,
    error: errorReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

export default store;
