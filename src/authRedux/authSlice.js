import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { registerAPI } from "../api/authAPI.js";

// ASYNC THUNK
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (formData, { rejectWithValue }) => {
    try {
      const data = await registerAPI(formData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { msg: "Something went wrong" }
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: localStorage.getItem("token") || null,
    user: null,
    isAuthenticate: false,
    loading: false,
    error: null,
  },
  reducers: {},

  extraReducers: (builder) => {
    builder
      // REGISTER
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.msg || "Registration failed";
      });
  },
});

export default authSlice.reducer;