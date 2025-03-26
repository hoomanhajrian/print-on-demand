// src/features/alert/alertSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AlertState {
  open: boolean;
  message: string;
  status: "success" | "warning" | "error" | "info" | null;
  timeout: number;
}

const initialState: AlertState = {
  open: false,
  message: "",
  status: null,
  timeout: 5000,
};

export const alertSlice = createSlice({
  name: "alert",
  initialState,
  reducers: {
    showAlert: (
      state,
      action: PayloadAction<{
        message: string;
        status: "success" | "warning" | "error" | "info";
        timeout?: number;
      }>
    ) => {
      state.open = true;
      state.message = action.payload.message;
      state.status = action.payload.status;
      state.timeout = action.payload.timeout || 5000;
    },
    hideAlert: (state) => {
      state.open = false;
      state.message = "";
      state.status = null;
    },
  },
});

export const { showAlert, hideAlert } = alertSlice.actions;

export default alertSlice.reducer;
