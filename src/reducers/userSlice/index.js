import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { userApiSlice } from "reducers/apiSlice";

export const getUsers = createAsyncThunk(
  "getUsers",
  async ({ name, count, startIndex, userId }, { rejectWithValue }) => {
    try {
      const response = await userApiSlice.get(
        `/search?name=${name}&startIndex=${startIndex}&count=${count}&userId=${userId}`
      );
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.data);
    }
  }
);

export const uploadPicture = createAsyncThunk(
  "uploadPicture",
  async ({ file, imageId }, { rejectWithValue }) => {
    try {
      const uploadConfig = await userApiSlice.get(
        `/upload?imageUuid=${imageId}`
      );

      await axios.put(uploadConfig.data.url, file, {
        headers: {
          "Content-Type": file.type,
        },
      });
      const response = await userApiSlice.post("/upload", {
        url: uploadConfig.data.imageKey,
      });
      return response;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.data);
    }
  }
);

export const editProfile = createAsyncThunk(
  "editProfile",
  async ({ password = null, src = null, id }, { rejectWithValue }) => {
    try {
      const response = await userApiSlice.put(`/user`, {
        password,
        src,
        id,
      });
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.data);
    }
  }
);

export const getSignedInUser = createAsyncThunk(
  "getUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await userApiSlice.get(`/getUser`);
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.data);
    }
  }
);

export const addFriend = createAsyncThunk(
  "addFriend",
  async ({ friendId, userId }, { rejectWithValue }) => {
    try {
      const response = await userApiSlice.post(`/addFriend`, {
        friendId,
        userId,
      });
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.data);
    }
  }
);

const initialState = {
  users: [],
  user: null,
  userLoading: "idle",
  signedInUserStatus: "idle",
  loading: "idle",
};

const usersSlice = createSlice({
  initialState,
  name: "users",
  end: false,
  friendRequestMessage: "",
  uploadImageMessage: "",
  reducers: {
    defaultLoader: (state) => {
      state.loading = "idle";
      state.userLoading = "idle";
      state.error = "";
      state.end = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getUsers.fulfilled, (state, action) => {
      if (action.payload?.message) {
        state.end = true;
      } else {
        state.users = action.payload;
      }
      state.userLoading = "success";
    });
    builder.addCase(getUsers.pending, (state) => {
      state.userLoading = "inProgress";
    });
    builder.addCase(getUsers.rejected, (state, action) => {
      const { payload } = action;
      state.loading = "failed";
      state.error = payload?.error ? payload.error : payload?.message;
    });

    builder.addCase(addFriend.fulfilled, (state, action) => {
      state.friendRequestMessage = "success";
    });
    builder.addCase(addFriend.pending, (state, action) => {
      state.friendRequestMessage = "inProgress";
    });
    builder.addCase(addFriend.rejected, (state, action) => {
      state.friendRequestMessage = "failed";
    });

    builder.addCase(getSignedInUser.fulfilled, (state, action) => {
      state.signedInUserStatus = "success";
      const { user } = action.payload;
      state.user = user;
    });
    builder.addCase(getSignedInUser.pending, (state, action) => {
      state.signedInUserStatus = "inProgress";
    });
    builder.addCase(getSignedInUser.rejected, (state, action) => {
      state.signedInUserStatus = "failed";
    });

    builder.addCase(uploadPicture.fulfilled, (state, action) => {
      state.uploadImageMessage = "success";
    });
    builder.addCase(uploadPicture.pending, (state, action) => {
      state.uploadImageMessage = "inProgress";
    });
    builder.addCase(uploadPicture.rejected, (state, action) => {
      state.uploadImageMessage = "failed";
    });
    builder.addCase(editProfile.pending, (state, action) => {
      state.loading = "inProgress";
    });
    builder.addCase(editProfile.rejected, (state, action) => {
      state.loading = "Some error occured";
    });
    builder.addCase(editProfile.fulfilled, (state, action) => {
      state.loading = "success";
    });
  },
});
export const { defaultLoader } = usersSlice.actions;
export default usersSlice.reducer;
