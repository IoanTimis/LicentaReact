import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import userReducer from "./features/user/userSlice";
import topicReducer from "./features/topics/topicSlice";
import requestReducer from "./features/requests/requestSlice";
import errorReducer from "./features/error/errorSlice";
import { combineReducers } from "redux";
import { thunk } from "redux-thunk"; 

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user"], 
};

const rootReducer = combineReducers({
  user: userReducer,
  topics: topicReducer,
  requests: requestReducer,
  error: errorReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer, 
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      thunk,
    }),
  devTools: process.env.NODE_ENV === "production",
});

const persistor = persistStore(store);

export { store, persistor };
