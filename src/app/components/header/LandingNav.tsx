import Link from 'next/link';

export default function LandingNav() {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="text-white font-bold text-xl">
          Print-on-Demand
        </Link>
        <div className="flex space-x-4">
          <Link href="/users" className="text-gray-300 hover:text-white">
            Users
          </Link>
          <Link href="/products" className="text-gray-300 hover:text-white">
            Products
          </Link>
          <Link href="/orders" className="text-gray-300 hover:text-white">
            Orders
          </Link>
        </div>
      </div>
    </nav>
  );
}