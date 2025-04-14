// src/app/store.ts
import { configureStore } from "@reduxjs/toolkit";
import alertReducer from "@/app/features/alert/alertSlice";
import userReducer from "@/app/features/auth/userSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    alert: alertReducer,
    // Add other reducers here
  },

  devTools: process.env.NODE_ENV !== "production",
});

store.subscribe(() => {
  const state = store.getState();
  console.log("Current state:", state);
  // You can also log specific slices of the state if needed
  // console.log("Auth state:", state.auth);
  // console.log("Alert state:", state.alert);
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
