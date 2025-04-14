"use client";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useDispatch } from "react-redux";
import { clearUser } from "@/app/features/auth/userSlice";

export default function AdminNav() {
  const dispatch = useDispatch();
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/admin" className="text-white font-bold text-xl">
          Print-on-Demand
        </Link>
        <div className="flex space-x-4">
          <Link href="/admin" className="text-gray-300 hover:text-white">
            Dashboard
          </Link>
          <Link href="/admin/users" className="text-gray-300 hover:text-white">
            Users
          </Link>
          <Link href="/admin/gigs" className="text-gray-300 hover:text-white">
            Gigs
          </Link>
          <Link href="/admin/orders" className="text-gray-300 hover:text-white">
            Orders
          </Link>
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
        </div>
      </div>
    </nav>
  );
}
