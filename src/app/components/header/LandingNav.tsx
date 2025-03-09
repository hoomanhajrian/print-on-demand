"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import LoginCard from '@/app/components/auth/LoginCard';
import { useSession, signOut } from 'next-auth/react';
import { Session } from 'next-auth';
import { useRouter, usePathname } from 'next/navigation';
import { Role } from '@/app/types';

export default function LandingNav() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { data: session } = useSession() as { data: (Session & { user: { role: Role } }) | null };
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check if the user is authenticated and authorized on route change
    const checkAuth = () => {
      const isAdminRoute = pathname?.startsWith('/admin');
      const isUserRoute = pathname === '/main';

      if (isAdminRoute) {
        if (!session?.user || (session?.user.role !== Role.ADMIN && session?.user.role !== Role.EDITOR)) {
          router.push('/auth/signin');
        }
      } else if (isUserRoute && !session?.user) {
        router.push('/auth/signin');
      }
    };

    checkAuth();
  }, [session, pathname, router]);

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

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
              <svg className="-mr-1 size-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
                <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <div className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white ring-1 shadow-lg ring-black/5 focus:outline-hidden" role="menu" aria-orientation="vertical" aria-labelledby="menu-button">
            <div className="py-1" role="none">
              <div>
              <Link href="/admin" className="block px-4 py-2 text-sm text-gray-700">
                      Admin
                    </Link>
                    <Link href="/admin" className="block px-4 py-2 text-sm text-gray-700">
                      Main
                    </Link>
              </div>
              {session?.user ? (
                <>
                  {(session?.user.role === Role.ADMIN || session?.user.role === Role.EDITOR) && (
                    <Link href="/admin" className="block px-4 py-2 text-sm text-gray-700">
                      Admin
                    </Link>
                  )}
                  <Link href="/main" className="block px-4 py-2 text-sm text-gray-700">
                    User
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="block px-4 py-2 text-sm text-gray-700"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <button
                  onClick={openLoginModal}
                  className="block px-4 py-2 text-sm text-gray-700"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <LoginCard
        isOpen={isLoginModalOpen}
        onClose={closeLoginModal}
        callbackUrl="/admin"
      />
    </nav>
  );
}