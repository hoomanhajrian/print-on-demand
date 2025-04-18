import Providers from "@/app/providers/Providers";
import { Lilita_One } from "next/font/google";
import "./globals.css";
import IdleLogout from "./components/auth/IdleLogout";
import AlertComponent from "@/app/components/notification/AlertComponent";

const lilitaOne = Lilita_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-lilita",
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <html lang="en">
        <IdleLogout />
        <body className={lilitaOne.variable}>
          <AlertComponent />
          {children}
        </body>
      </html>
    </Providers>
  );
}
export const metadata = {
  title: "Print-On-Demand",
  description: "Print-On-Demand Platform",
};
export const dynamic = "force-dynamic"; // This page will always be server-rendered
export const dynamicParams = false; // This page will never be cached
export const preferredRegion = "auto"; // This page will always be server-rendered
export const runtime = "edge"; // This page will always be server-rendered
