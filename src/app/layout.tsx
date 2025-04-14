import Providers from "@/app/providers/Providers";
import { Roboto } from "next/font/google";
import "./globals.css";
import IdleLogout from "./components/auth/IdleLogout";
import AlertComponent from "@/app/components/notification/AlertComponent";

const roboto = Roboto({ subsets: ["latin"], variable: "--font-roboto" });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <html lang="en">
        <IdleLogout />
        <body className={roboto.variable}>
          <AlertComponent />
          {children}
        </body>
      </html>
    </Providers>
  );
}
export const dynamic = "force-dynamic"; // This page will always be server-rendered
export const metadata = {
  title: "Print-On-Demand",
  description: "Print-On-Demand Platform",
};
export const revalidate = 0; // This page will never be cached
export const fetchCache = "force-no-store"; // This page will never be cached
export const dynamicParams = false; // This page will never be cached
export const preferredRegion = "auto"; // This page will always be server-rendered
export const runtime = "edge"; // This page will always be server-rendered
