import Navbar from "../components/header/Navbar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "User Dashboard",
  description: "User area for managing the print-on-demand platform",
};

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="main-layout">
      <Navbar />
      <div className="main-content">{children}</div>
    </div>
  );
}
