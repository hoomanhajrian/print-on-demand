"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Role, User } from '@/app/types'; // Import the Role enum and User interface

interface AuthCheckProps {
  children: React.ReactNode;
}

export default function AuthCheck({ children }: AuthCheckProps) {
  const { data: session, status } = useSession() as { data: { user: User } | null, status: string };
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") {
      return; // Optionally show a loading indicator
    }

    if (!session?.user) {
      router.push('/'); // Redirect to root if not authenticated
      return;
    }

    // Check user role and redirect accordingly
    if (session?.user.role === Role.ADMIN || session?.user.role === Role.EDITOR) {
      router.push('/admin'); // Redirect to admin dashboard
    } else if (session?.user.role === Role.CLIENT || session?.user.role === Role.PRINTER) {
      router.push('/main'); // Redirect to main dashboard
    } else {
      // Handle unknown roles or redirect to a default page
      router.push('/');
    }
  }, [session, router, status]);

  return <>{children}</>;
}