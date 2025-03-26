"use client";
import { FC, useEffect } from "react";
import { Alert, Stack } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { hideAlert } from "@/app/features/alert/alertSlice";
import { RootState, AppDispatch } from "@/app/store";

interface AlertComponentProps {
  // We'll use Redux state instead of props
}

const AlertComponent: FC<AlertComponentProps> = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { open, message, status, timeout } = useSelector(
    (state: RootState) => state.alert
  );

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        dispatch(hideAlert());
      }, timeout);

      return () => clearTimeout(timer);
    }
  }, [open, timeout, dispatch]);

  return (
    <Stack
      spacing={2}
      direction="column"
      sx={{
        width: "250px",
        position: "absolute",
        top: "80%",
        left: "40%",
        zIndex: 1000,
      }}
    >
      <Alert
        variant="filled"
        severity={status || "error"}
        sx={{ display: open ? "flex" : "none" }}
      >
        {message}
      </Alert>
    </Stack>
  );
};

export default AlertComponent;
