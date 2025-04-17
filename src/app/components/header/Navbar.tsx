"use client";
import { useRef } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useDispatch } from "react-redux";
import { clearUser } from "@/app/features/auth/userSlice";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { getUser } from "@/app/features/auth/userSlice";
import { setUserFromToken } from "@/app/features/auth/userSlice";
import { redirect } from "next/navigation";
import { AccountButton } from "@/app/components/subComponents/AccountButton";
export const Navbar = () => {
  const session = useSession();
  const navRef = useRef<HTMLDivElement | null>(null);
  const { data: user } = session;
  // Check if user is logged in
  if (!user) {
    redirect("/");
  }
  const dispatch = useDispatch();
  useEffect(() => {
    const handleStorageChange = () => {
      const userData = sessionStorage.getItem("user");
      if (userData) {
        const parsedUser = JSON.parse(userData);
        dispatch(setUserFromToken(parsedUser));
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [user, dispatch]);

  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900 flex flex-wrap items-center justify-between p-5">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto w-full p-4">
        <Link
          href="/main"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <img
            src="https://flowbite.com/docs/images/logo.svg"
            className="h-8"
            alt="Flowbite Logo"
          />
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            Print-on-Demand
          </span>
        </Link>

        <div className="w-full md:block md:w-auto" ref={navRef}>
          <ul className="font-medium flex flex-row p-4 md:p-0 mt-4 border items-center justify-around border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li>
              <Link
                href="/main"
                className="block py-2 px-3 text-white bg-blue-700 rounded-sm md:bg-transparent md:text-blue-700 md:p-0 dark:text-white md:dark:text-blue-500"
                aria-current="page"
              >
                Dashboard
              </Link>
            </li>

            <li>
              <AccountButton />
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
