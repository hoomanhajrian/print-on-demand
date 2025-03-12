"use client";
import Link from "next/link";
import { signOut } from "next-auth/react";

export default function Navbar() {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/main" className="text-white font-bold text-xl">
          Print-on-Demand
        </Link>
        <div className="flex space-x-4">
          <Link href="/main" className="text-gray-300 hover:text-white">
            Dashboard
          </Link>
          <Link href="/main/gigs" className="text-gray-300 hover:text-white">
            Gigs
          </Link>
          <Link href="/main/orders" className="text-gray-300 hover:text-white">
            Orders
          </Link>
          <Link href="/main/profile" className="text-gray-300 hover:text-white">
            Profile
          </Link>
          <button
            type="button"
            className="focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:focus:ring-yellow-900"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
}
