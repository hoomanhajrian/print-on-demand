"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import LoginCard from "@/app/components/auth/LoginCard";
import { useSession, signOut } from "next-auth/react";
import { Session } from "next-auth";
import { Role } from "@/app/types";
import { useDispatch } from "react-redux";
import { clearUser } from "@/app/features/auth/userSlice";

export default function LandingNav() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const session = useSession().data as Session & { user: { role: Role } };
  const dispatch = useDispatch();
  const openLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };
  useEffect(() => {}, [session?.user]);

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="text-white font-bold text-xl">
          Print-on-Demand
        </Link>
        <div className="relative inline-block text-left">
          <div>
            <button
              type="button"
              className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50"
              id="menu-button"
              aria-expanded="true"
              aria-haspopup="true"
              onClick={openLoginModal} // Open login modal on click
            >
              Options
              <svg
                className="-mr-1 size-5 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
                data-slot="icon"
              >
                <path
                  fillRule="evenodd"
                  d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
          <div
            className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white ring-1 shadow-lg ring-black/5 focus:outline-hidden"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="menu-button"
          >
            <div className="py-1" role="none">
              <div>
                <Link
                  href="/admin"
                  className="block px-4 py-2 text-sm text-gray-700"
                >
                  Admin
                </Link>
                <Link
                  href="/main"
                  className="block px-4 py-2 text-sm text-gray-700"
                >
                  Main
                </Link>
              </div>
            </div>
          </div>
        </div>
        {session?.user ? (
          <button
            type="button"
            className="focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:focus:ring-yellow-900"
            onClick={() => {
              dispatch(clearUser());
              signOut({ callbackUrl: "/" });
            }}
          >
            Sign Out
          </button>
        ) : (
          <button
            type="button"
            className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
            onClick={openLoginModal}
          >
            Login
          </button>
        )}
      </div>
      <LoginCard
        isOpen={isLoginModalOpen}
        onClose={closeLoginModal}
        callbackUrl="/admin"
      />
    </nav>
  );
}
