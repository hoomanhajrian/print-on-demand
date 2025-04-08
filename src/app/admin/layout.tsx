import type { Metadata } from "next";
import AdminNav from "../components/header/AdminNav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <AdminNav />
      <div className="main-content">{children}</div>
    </div>
  );
}

export const dynamic = "force-dynamic"; // This page will always be server-rendered
export const revalidate = 0; // This page will never be cached
export const fetchCache = "force-no-store"; // This page will never be cached
export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Admin area for managing the print-on-demand platform",
};
export const dynamicParams = false; // This page will never be cached
export const preferredRegion = "auto"; // This page will always be server-rendered
