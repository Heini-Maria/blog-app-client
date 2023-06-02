import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  authState: {
    username: "",
    id: 0,
    status: false,
  },
  theme: "light",
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setAuthState: (state, action) => {
      state.authState = action.payload;
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
  },
});
export const { setTheme, setAuthState } = appSlice.actions;

export default appSlice.reducer;
