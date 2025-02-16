import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Base API URL
const API_URL = "http://localhost:3000/api/auth";

// Async thunk for signup
export const signupUser = createAsyncThunk(
  "auth/signupUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/signup`, userData);
      return response.data; // Expected response: { success: true, message: "Signup successful", user }
    } catch (error) {
      const message = error.response?.data?.message || "Failed to signup. Please try again.";
      return rejectWithValue(message);
    }
  }
);

// Async thunk for email verification
export const verifyEmail = createAsyncThunk(
  "auth/verifyEmail",
  async (token, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/verify-email`, { code: token });
      return response.data; // Expected response: { success: true, message: "Email successfully verified!" }
    } catch (error) {
      const message = error.response?.data?.message || "Failed to verify email. Please try again.";
      return rejectWithValue(message);
    }
  }
);

// Async thunk for login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/login`, userData);
      return response.data; // Expected response: { success: true, message: "Login successful", user }
    } catch (error) {
      const message = error.response?.data?.message || "Failed to login. Please try again.";
      return rejectWithValue(message);
    }
  }
);

const isCheckingauth = createAsyncThunk(
  "auth/isCheckingauth",
  async (token, { rejectWithValue }) => {
    const response = axios.get(`${API_URL}/check-auth`)
    return response.data
  }
)

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: false,
    error: null,
    success: false,
    verificationStatus: null, // Added
  },
  reducers: {
    resetState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.verificationStatus = null; // Reset verification status
      state.user = null; // Reset user data on state reset (e.g., logout)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.user = action.payload?.user || null;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "An unknown error occurred.";
        state.success = false;
      })
      .addCase(verifyEmail.pending, (state) => {
        state.loading = true;
        state.verificationStatus = null;
      })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.verificationStatus = "success";
        state.user = action.payload?.user || null;
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.loading = false;
        state.verificationStatus = "failed";
        state.error = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.user = action.payload?.user || null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to login. Please try again.";
        state.success = false;
      });
  },
});

export const { resetState } = authSlice.actions;
export default authSlice.reducer;
