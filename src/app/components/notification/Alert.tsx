"use client";
import { FC, useEffect, useState } from "react";
import { Alert, Stack } from "@mui/material";
import { set } from "react-hook-form";
interface AlertProps {
  status: "success" | "warning" | "error" | "info";
  message: string;
}

const AlertComponent: FC<AlertProps> = ({
  message = "Message Box",
  status = "error",
}) => {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(true);
    setTimeout(() => {
      setOpen(false);
    }, 5000);
  };

  useEffect(() => {
    handleClose();
  }, []);

  return (
    <Stack
      sx={{
        width: "100%",
        position: "absolute",
        top: "100%",
        left: "50%",
        transform: "translate(-50%, -10%)",
        zIndex: 1000,
      }}
      spacing={2}
    >
      <Alert
        variant="filled"
        severity={status}
        sx={{ display: open ? "flex" : "none" }}
      >
        {message}
      </Alert>
    </Stack>
  );
};

export default AlertComponent;
