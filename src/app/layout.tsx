import { Roboto } from "next/font/google";
import Providers from "@/app/providers/Providers";
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
    <html lang="en">
      <Providers>
        <IdleLogout />
        <body className={roboto.variable}>
          <AlertComponent />
          {children}
        </body>
      </Providers>
    </html>
  );
}
