import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  "login/loginUser",
  async (userData) => {
    const response = await axios.post(
      "https://blog-app-api-production-651f.up.railway.app/auth/login",
      userData
    );
    if (response.data.error) {
      alert(response.data.error);
      return;
    }
    localStorage.setItem("accessToken", response.data.token);
    return response.data;
  }
);

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      });
  },
});

export default loginSlice.reducer;
