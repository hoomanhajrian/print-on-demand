"use client";

import { Roboto } from 'next/font/google';
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Role, User } from './types'; // Import the Role enum and User interface
import Providers from '@/app/providers/SessionProvider'; // Import Providers
import AuthCheck from '@/app/providers/AuthCheck'; // Import AuthCheck

import './globals.css';

const roboto = Roboto({ subsets: ['latin'], variable: '--font-roboto' });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Providers>
      <html lang="en">
        <body className={roboto.variable}>
          <AuthCheck>
            {children}
          </AuthCheck>
        </body>
      </html>
    </Providers>
  );
}