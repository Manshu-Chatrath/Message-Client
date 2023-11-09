import { configureStore } from "@reduxjs/toolkit";
import authSlice from "reducers/authSlice";
import socketSlice from "./socketSlice";
import userSlice from "reducers/userSlice";
export const store = configureStore({
  reducer: {
    auth: authSlice,
    users: userSlice,
    socket: socketSlice,
  },
});
