import { Roboto } from "next/font/google";
import Providers from "@/app/providers/SessionProvider";
import "./globals.css";

const roboto = Roboto({ subsets: ["latin"], variable: "--font-roboto" });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Providers>
        <body className={roboto.variable}>{children}</body>
      </Providers>
    </html>
  );
}
