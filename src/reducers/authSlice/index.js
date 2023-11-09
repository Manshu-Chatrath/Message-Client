import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authApiSlice } from "reducers/apiSlice";

export const signUpUser = createAsyncThunk(
  "users/signUp",
  async (data, { rejectWithValue }) => {
    try {
      const response = await authApiSlice.post("/signUp", data);
      return response;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.data);
    }
  }
);

export const loginUser = createAsyncThunk(
  "users/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await authApiSlice.post("/login", { email, password });
      return response;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.data);
    }
  }
);

const initialState = {
  token: null,
  loading: "idle",
  error: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  user: "",
  reducers: {
    defaultLoader: (state) => {
      state.loading = "idle";
      state.error = "";
    },
    setAuth: (state, action) => {
      state.token = action.payload.token;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(signUpUser.pending, (state) => {
      state.loading = "inProgress";
    });
    builder.addCase(signUpUser.rejected, (state, action) => {
      const { payload } = action;
      state.loading = "failed";
      state.error = payload?.error ? payload.error : payload?.message;
    });
    builder.addCase(signUpUser.fulfilled, (state) => {
      state.loading = "success";
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.loading = "success";
      const { payload } = action;
      const { data } = payload;
      state.token = data.token;
      localStorage.setItem("token", state.token);
    });
    builder.addCase(loginUser.pending, (state) => {
      state.loading = "inProgress";
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      const { payload } = action;
      state.loading = "failed";
      state.error = payload?.error ? payload.error : payload?.message;
    });
  },
});
export const { defaultLoader, setAuth } = authSlice.actions;
export default authSlice.reducer;
