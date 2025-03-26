"use client";
import { SessionProvider } from "next-auth/react";
import { Provider } from "react-redux";
import { store } from "@/app/store";

interface ProviderProps {
  children: React.ReactNode;
}

function Providers({ children }: ProviderProps) {
  return (
    <SessionProvider>
      <Provider store={store}>{children}</Provider>
    </SessionProvider>
  );
}

export default Providers;
