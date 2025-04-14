"use client";
import { FC, useEffect, useState } from "react";
import { Alert, Stack } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { hideAlert } from "@/app/features/alert/alertSlice";
import { RootState, AppDispatch } from "@/app/features/store";

const AlertComponent: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { open, message, status, timeout } = useSelector(
    (state: RootState) => state.alert
  );

  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true); // Mark the component as hydrated
  }, []);

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        dispatch(hideAlert());
      }, timeout);

      return () => clearTimeout(timer);
    }
  }, [open, timeout, dispatch]);

  // Prevent rendering until hydration is complete
  if (!isHydrated) {
    return null;
  }

  return (
    <>
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
        component={"div"}
      >
        <Alert
          variant="filled"
          severity={status || "error"}
          sx={{ display: open ? "flex" : "none" }}
        >
          {message}
        </Alert>
      </Stack>
    </>
  );
};

export default AlertComponent;
