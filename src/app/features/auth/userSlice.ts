import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  email: string | null;
  name: string | null;
}

const initialState: UserState = {
  email: null,
  name: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserFromToken: (state, action: PayloadAction<UserState>) => {
      state.email = action.payload.email;
      state.name = action.payload.name;

      // Save user data to sessionStorage (client-side only)
      if (typeof window !== "undefined") {
        sessionStorage.setItem(
          "user",
          JSON.stringify({
            name: action.payload.name,
            email: action.payload.email,
          })
        );
      }
    },
    clearUser: (state) => {
      state.email = null;
      state.name = null;

      // Remove user data from sessionStorage (client-side only)
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("user");
      }
    },
  },
});

export const { setUserFromToken, clearUser } = userSlice.actions;

export const getUser = (state: { user: UserState }) => {
  // Check if running on the client side
  if (typeof window !== "undefined") {
    const userFromStorage = sessionStorage.getItem("user");
    if (userFromStorage) {
      return JSON.parse(userFromStorage);
    }
  }

  // Fallback to Redux state
  return state.user;
};

export default userSlice.reducer;
