"use client";

import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Role, User } from "@/app/types";

import '../globals.css';

const roboto = Roboto({ subsets: ['latin'], variable: '--font-roboto' });

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Admin area for managing the print-on-demand platform',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession({ required: true, onUnauthenticated() { router.push('/'); } });
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") {
      return; // Optionally show a loading indicator
    }

    if (!session?.user || !(session.user as User).role) {
      router.push('/'); // Redirect to root if not authenticated
      return;
    }

    if ((session.user as User).role !== Role.ADMIN && (session.user as User).role !== Role.EDITOR) {
      router.push('/'); // Redirect to root if not authorized
    }
  }, [session, router, status]);

  return (
    <html lang="en">
      <body className={roboto.variable}>
        {children}
      </body>
    </html>
  );
}