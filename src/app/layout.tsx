import { Roboto } from "next/font/google";
import Providers from "@/app/providers/SessionProvider";
import "./globals.css";
import { Alert } from "./components/notification/Alert";

const roboto = Roboto({ subsets: ["latin"], variable: "--font-roboto" });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <html lang="en">
        <body className={roboto.variable}>
          {children}
          <Alert status={"success"} message="This is an alert message" />
        </body>
      </html>
    </Providers>
  );
}
