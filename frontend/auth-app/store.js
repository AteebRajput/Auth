import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./src/store/AuthSlice.js"; // Use default import, not named import

export const store = configureStore({
  reducer: {
    auth: authReducer, // Aligns with the `auth` slice name.
  },
});

export default store;
