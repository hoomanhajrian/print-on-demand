"use client";
import Link from 'next/link';
import { signOut } from 'next-auth/react';

export default function Navbar() {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/main" className="text-white font-bold text-xl">
          Print-on-Demand
        </Link>
        <div className="flex space-x-4">
          <Link href="/admin/users" className="text-gray-300 hover:text-white">
            Users
          </Link>
          <Link href="/admin/products" className="text-gray-300 hover:text-white">
            Products
          </Link>
          <Link href="/admin/orders" className="text-gray-300 hover:text-white">
            Orders
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="block px-4 py-2 text-sm text-gray-700"
          >
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
}