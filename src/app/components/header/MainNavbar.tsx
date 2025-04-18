"use client";
import { useRef } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setUserFromToken } from "@/app/features/auth/userSlice";
import { redirect } from "next/navigation";
import { AccountButton } from "@/app/components/subComponents/AccountButton";
import $ from "jquery";
import { Category } from "@prisma/client";

const categories: Category[] = [
  { id: "1", name: "Toys" },
  { id: "2", name: "Tools" },
  { id: "3", name: "Mugs" },
  { id: "4", name: "Customized" },
  { id: "5", name: "Construction" },
  { id: "6", name: "Wearables" },
];

export const MainNavbar = () => {
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        navRef.current &&
        !navRef.current.contains(target) &&
        !target.closest("#dropdownNavbarLink")
      ) {
        const dropdown = $("#dropdownNavbar");
        dropdown.addClass("hidden");
        dropdown.removeClass("absolute");
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

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
                className="flex items-center justify-between w-full py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 md:w-auto dark:text-white md:dark:hover:text-blue-500 dark:focus:text-white dark:border-gray-700 dark:hover:bg-gray-700 md:dark:hover:bg-transparent"
                aria-current="page"
              >
                Dashboard
              </Link>
            </li>

            <li>
              <button
                id="dropdownNavbarLink"
                data-dropdown-toggle="dropdownNavbar"
                className="flex items-center justify-between w-full py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 md:w-auto dark:text-white md:dark:hover:text-blue-500 dark:focus:text-white dark:border-gray-700 dark:hover:bg-gray-700 md:dark:hover:bg-transparent"
                type="button"
                onClick={() => {
                  const dropdown = $("#dropdownNavbar");
                  dropdown.toggleClass("hidden");
                  dropdown.toggleClass("absolute");
                }}
              >
                Categories
                <svg
                  className="w-2.5 h-2.5 ms-2.5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 4 4 4-4"
                  />
                </svg>
              </button>
              <div
                id="dropdownNavbar"
                className="z-10 hidden font-normal bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700 dark:divide-gray-600"
              >
                <ul
                  className="py-2 text-sm text-gray-700 dark:text-gray-400"
                  aria-labelledby="dropdownLargeButton"
                >
                  {categories.map((category) => (
                    <li key={category.id}>
                      <Link
                        href={`/main/gigs/${category.name}`}
                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        {category.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
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
