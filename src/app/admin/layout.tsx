import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { useRouter } from "next/navigation";
import "../globals.css";
import Navbar from "../components/header/Navbar";
import AdminNav from "../components/header/AdminNav";

const roboto = Roboto({ subsets: ["latin"], variable: "--font-roboto" });

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Admin area for managing the print-on-demand platform",
};

export default function AdminLayout({
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
