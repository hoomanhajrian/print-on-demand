import type { Metadata } from "next";
import AdminNav from "../components/header/AdminNav";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Admin area for managing the print-on-demand platform",
};

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
