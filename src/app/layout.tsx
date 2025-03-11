"use client";

import { Roboto } from 'next/font/google';
import Providers from '@/app/providers/SessionProvider'; // Import Providers

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
            {children}
        </body>
      </html>
    </Providers>
  );
}