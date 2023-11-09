import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authApiSlice } from "reducers/apiSlice";

const initialState = {
  socket: null,
  friends: {},
  messages: [],
  notifications: {},
  friendRequests: [],
  sentRequests: {},
};

const socketSlice = createSlice({
  name: "socket",
  initialState,

  reducers: {
    defaultMessages: (state) => {
      state.messages = [];
    },
    setNotifications: (state, action) => {
      state.notifications = { ...action.payload };
    },

    recentNotification: (state, action) => {
      if (Object.keys(state.notifications).length !== 0) {
        if (state.notifications?.[action.payload.sentBy]) {
          state.notifications[action.payload.sentBy].notifications++;
        }
      } else {
        state.notifications[action.payload.sentBy] = { ...action.payload };
      }
    },
    setSocket: (state, action) => {
      state.socket = action.payload;
    },
    setFriendRequests: (state, action) => {
      state.friendRequests = { ...action.payload };
    },
    setFriends: (state, action) => {
      state.friends = { ...action.payload };
    },
    resetFriends: (state, action) => {
      const { socketId, id } = action.payload;
      if (state.friends?.[id]) {
        state.friends[id].socketId = socketId;
      }
    },
    getAllMessages: (state, action) => {
      state.messages = [...action.payload];
    },
    recentMessage: (state, action) => {
      const arr = [...state.messages];
      arr.push(action.payload);
      state.messages = [...arr];
    },

    allSentRequests: (state, action) => {
      state.sentRequests = { ...action.payload };
    },
  },
});
export const {
  setSocket,
  setFriends,
  resetFriends,
  getAllMessages,
  setFriendRequests,
  recentMessage,
  allSentRequests,
  setNotifications,
  recentNotification,
  defaultMessages,
} = socketSlice.actions;
export default socketSlice.reducer;
