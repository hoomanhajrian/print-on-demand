import Link from "next/link";

export default function AdminNav() {
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
        </div>
      </div>
    </nav>
  );
}
