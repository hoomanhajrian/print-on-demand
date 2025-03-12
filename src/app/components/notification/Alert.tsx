"use client";
import { FC, useEffect, useState } from "react";
interface AlertProps {
  status: "success" | "warning" | "error" | "info";
  message: string;
}

export const Alert: FC<AlertProps> = ({ message, status }) => {
  const [show, setShow] = useState(false);

  const showAlert = () => {
    setTimeout(() => {
      setShow(false);
    }, 5000);
  };

  useEffect(() => {
    showAlert();
    return () => {
      setShow(false);
    };
  }, []);
  switch (status) {
    case "success":
      return (
        <div className={show ? "block" : "hidden"}>
          <div
            className="p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400"
            role="alert"
          >
            <span className="font-medium">Info alert!</span> {message}
          </div>
        </div>
      );
    case "warning":
      return (
        <div className={show ? "block" : "hidden"}>
          <div
            className="p-4 mb-4 text-sm text-yellow-800 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-400"
            role="alert"
          >
            <span className="font-medium">Warning alert!</span> {message}
          </div>
        </div>
      );
    case "error":
      return (
        <div className={show ? "block" : "hidden"}>
          <div
            className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
            role="alert"
          >
            <span className="font-medium">Error alert!</span> {message}
          </div>
        </div>
      );
    case "info":
      return (
        <div className={show ? "block" : "hidden"}>
          <div
            className="p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400"
            role="alert"
          >
            <span className="font-medium">Info alert!</span> {message}
          </div>
        </div>
      );
    default:
      return null;
  }
};
