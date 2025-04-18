import { MainNavbar } from "../components/header/MainNavbar";
import { Metadata } from "next";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="main-layout">
      <MainNavbar />
      <div className="main-content">{children}</div>
    </div>
  );
}
export const dynamic = "force-dynamic"; // This page will always be server-rendered
export const metadata: Metadata = {
  title: "User Dashboard",
  description: "User area for managing the print-on-demand platform",
};
