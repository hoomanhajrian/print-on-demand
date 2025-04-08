"use client";

import { useEffect } from "react";
import { signOut, getSession } from "next-auth/react";
import { useDispatch } from "react-redux";
import { showAlert } from "@/app/features/alert/alertSlice";
import { clearUser } from "@/app/features/auth/userSlice";

const IdleLogout = ({ timeout = 300000 }: { timeout?: number }) => {
  // `timeout` is the inactivity duration in milliseconds (default: 5 minutes)
  const dispatch = useDispatch(); // Assuming you have a Redux store set up

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        handleLogout();
      }, timeout);
    };

    const handleLogout = async () => {
      const session = await getSession(); // Check if a session exists
      if (session) {
        dispatch(showAlert({ message: "Session expired", status: "warning" })); // Show alert for session expiration
        dispatch(clearUser()); // Clear user data from Redux store
        signOut(); // Logs out the user
      }
    };

    // Add event listeners for user activity
    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    window.addEventListener("scroll", resetTimer);
    window.addEventListener("click", resetTimer);

    // Start the timer
    resetTimer();

    // Cleanup event listeners on component unmount
    return () => {
      clearTimeout(timer);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("scroll", resetTimer);
      window.removeEventListener("click", resetTimer);
    };
  }, [timeout]);

  return null; // This component doesn't render anything
};

export default IdleLogout;
