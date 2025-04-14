"use client";
import { SessionProvider } from "next-auth/react";
import { Provider } from "react-redux";
import { store } from "@/app/features/store";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";

interface ProviderProps {
  children: React.ReactNode;
  pageProps?: { session: any };
}

function Providers({ children, pageProps }: ProviderProps) {
  return (
    <SessionProvider session={pageProps?.session}>
      <Provider store={store}>
        <AppRouterCacheProvider>{children}</AppRouterCacheProvider>
      </Provider>
    </SessionProvider>
  );
}

export default Providers;
